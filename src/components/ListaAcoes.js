import React, { useState, useEffect } from "react";
import { MaterialReactTable } from "material-react-table";
import { Backdrop, Box, Button, CircularProgress, IconButton, Tooltip } from "@mui/material";
import { MRT_Localization_PT_BR } from "material-react-table/locales/pt-BR";
import Star from "@mui/icons-material/Star";
import StarBorder from "@mui/icons-material/StarBorder";
import Download from "@mui/icons-material/Download";
import { ExportToCsv } from "export-to-csv";
import { darken } from "@mui/material";
import AcaoService from "../services/acaoService";

const columns = [
  { id: "ticker", accessorKey: "ticker", header: "Ticker", size: 80 },
  {
    accessorKey: "preco",
    header: "Preço",
    size: 80,
    Cell: ({ cell }) =>
      cell.getValue()?.toLocaleString?.("pt-BR", {
        style: "currency",
        currency: "BRL",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }),
  },
  { accessorKey: "roe", header: "Roe", size: 75 },
  { accessorKey: "dy", header: "DY", size: 80 },
  { accessorKey: "pvp", header: "PVP", size: 75 },
  { accessorKey: "vpa", header: "VPA", size: 85 },
  { accessorKey: "lpa", header: "LPA", size: 85 },
  { accessorKey: "pl", header: "PL", size: 75 },
  { accessorKey: "liquidez", header: "Liquidez", size: 140 },
  { accessorKey: "rankRoe", header: "Rank Roe", size: 75 },
  { accessorKey: "rankPl", header: "Rank Pl", size: 75 },
  { accessorKey: "somaFormula", header: "Soma Ranks", size: 85 },
  { accessorKey: "valorFormulaGrham", header: "Formula Grham", size: 110 },
  {
    accessorKey: "descontoFormulaGrham",
    header: "Desconto Formula Grham",
    size: 130,
    Cell: ({ cell }) => (
      <Box
        component="span"
        sx={(theme) => ({
          backgroundColor:
            cell.getValue() < 0
              ? theme.palette.error.light
              : cell.getValue() >= 0 && cell.getValue() < 30
              ? theme.palette.warning.light
              : theme.palette.success.light,
          borderRadius: "0.25rem",
          color: "#fff",
          maxWidth: "9ch",
          p: "0.25rem",
        })}
      >
        {cell.getValue()?.toLocaleString?.("pt-BR")}
      </Box>
    ),
  },
];

const csvOptions = {
  fieldSeparator: ";",
  quoteStrings: '"',
  decimalSeparator: ",",
  showLabels: true,
  useBom: true,
  useKeysAsHeaders: false,
  headers: columns.map((c) => c.header),
};

const csvExporter = new ExportToCsv(csvOptions);

function ListaAcoes() {
  const [lista, setLista] = useState([]);
  const [loading, setLoading] = React.useState(false);

  const handleExportData = () => {
    csvExporter.generateCsv(lista);
  };

  const handleFavoritar = async (favorita, ticker) => {
    setLoading(true);

    try {
      if (favorita) {
        await AcaoService.removerFavorita(ticker);
      } else {
        await AcaoService.adicionarFavorita(ticker);
      }

      setLista(prevLista =>
        prevLista.map(item =>
          item.ticker === ticker ? { ...item, favorita: !favorita } : item
        )
      );

      setLoading(false);
    } catch (error) {
      console.log(error);
      
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    AcaoService.getAcoes()
      .then((data) => {
        setLista(data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });

  }, []);

  return (
    <div>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="secondary" />
      </Backdrop>

      <MaterialReactTable
        data={lista}
        columns={columns}
        enableColumnFilterModes
        enableColumnOrdering
        enableColumnResizing
        enableRowActions
        initialState={{ density: 'compact', pagination: { pageSize: 15 } }}
        renderRowActions={({ row }) => (
          <Box sx={{ display: "flex", flexWrap: "nowrap", gap: "8px" }}>
            <IconButton
              color="secondary"
              
              onClick={() => {
                handleFavoritar(row.original.favorita, row.original.ticker);
              }}
            >
              {row.original.favorita ? <Tooltip title="Remover favorita"><Star /></Tooltip> : <Tooltip title="Adicionar favorita"><StarBorder /></Tooltip>}
            </IconButton>
          </Box>
        )}
        localization={MRT_Localization_PT_BR}
        renderTopToolbarCustomActions={({ table }) => (
          <Box
            sx={{ display: "flex", gap: "1rem", p: "0.5rem", flexWrap: "wrap" }}
          >
            <Button
              color="primary"
              onClick={handleExportData}
              startIcon={<Download />}
              variant="contained"
            >
              Exportar
            </Button>
          </Box>
        )}
        muiTablePaperProps={{
          elevation: 0,
          sx: {
            borderRadius: "0",
          },
        }}
        muiTableBodyProps={{
          sx: (theme) => ({
            "& tr:nth-of-type(odd)": {
              backgroundColor: darken(theme.palette.background.default, 0.1),
            },
          }),
        }}
      />
    </div>
  );
}

export default ListaAcoes;
