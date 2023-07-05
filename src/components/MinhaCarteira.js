import React, { useCallback, useEffect, useMemo, useState } from "react";
import { MaterialReactTable } from "material-react-table";
import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  TextField,
  Tooltip,
} from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import acaoUsuarioService from "../services/acaoUsuarioService";

class AcaoUsuario {
  constructor(
    id,
    ticker,
    login,
    precoMedio,
    precoTeto,
    precoAlvo,
    quantidade,
    percentualDesejado,
    valorTotal
  ) {
    this.id = id;
    this.ticker = ticker;
    this.login = login;
    this.precoMedio = precoMedio;
    this.precoTeto = precoTeto;
    this.precoAlvo = precoAlvo;
    this.quantidade = quantidade;
    this.percentualDesejado = percentualDesejado;
    this.valorTotal = valorTotal;
  }
}

const MinhaCarteira = () => {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [validationErrors, setValidationErrors] = useState({});
  const [loading, setLoading] = React.useState(false);

  useEffect(() => {
    acaoUsuarioService
      .getAcoes()
      .then((data) => {
        setTableData(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handleCreateNewRow = async (values) => {
    setLoading(true);

    try {
      const newRow = new AcaoUsuario(
        values.id,
        values.ticker,
        values.login,
        values.precoMedio,
        values.precoTeto,
        values.precoAlvo,
        values.quantidade,
        values.percentualDesejado,
        values.valorTotal
      );
      setTableData([...tableData, newRow]);

      await acaoUsuarioService.adicionarAcao(newRow);
      setLoading(false);
      console.log("Registro atualizado com sucesso!");
    } catch (error) {
      console.error("Ocorreu um erro ao atualizar o registro:", error);
      setLoading(false);
    }
  };

  const handleSaveRowEdits = async ({ exitEditingMode, row, values }) => {
    setLoading(true);
    if (!Object.keys(validationErrors).length) {
      try {
        const editedRow = new AcaoUsuario(
          values.id,
          values.ticker,
          values.login,
          values.precoMedio,
          values.precoTeto,
          values.precoAlvo,
          values.quantidade,
          values.percentualDesejado,
          values.valorTotal
        );
        tableData[row.index] = editedRow;

        setTableData([...tableData]);
        exitEditingMode();

        await acaoUsuarioService.editarAcao(editedRow);

        console.log("Registro atualizado com sucesso!");
        setLoading(false);
      } catch (error) {
        console.error("Ocorreu um erro ao atualizar o registro:", error);
        setLoading(false);
      }
    }
  };

  const handleCancelRowEdits = () => {
    setValidationErrors({});
  };

  const handleDeleteRow = useCallback(async (row) => {
    setLoading(true);
    try {
      await acaoUsuarioService.removerAcao(row.original.id);

      setTableData((prevTableData) =>
        prevTableData.filter((item, index) => index !== row.index)
      );

      console.log("Registro deletado com sucesso!");
      setLoading(false);
    } catch (error) {
      console.error("Ocorreu um erro ao deletar o registro:", error);
      setLoading(false);
    }
  }, []);

  const getCommonEditTextFieldProps = useCallback(
    (cell) => {
      return {
        error: !!validationErrors[cell.id],
        helperText: validationErrors[cell.id],
        onBlur: (event) => {
          const isValid =
            cell.column.id === "email"
              ? validateEmail(event.target.value)
              : cell.column.id === "age"
              ? validateAge(+event.target.value)
              : validateRequired(event.target.value);
          if (!isValid) {
            //set validation error for cell if invalid
            setValidationErrors({
              ...validationErrors,
              [cell.id]: `${cell.column.columnDef.header} is required`,
            });
          } else {
            //remove validation error for cell if valid
            delete validationErrors[cell.id];
            setValidationErrors({
              ...validationErrors,
            });
          }
        },
      };
    },
    [validationErrors]
  );

  const columns = useMemo(
    () => [
      {
        accessorKey: "id",
        header: "ID",
        enableColumnOrdering: false,
        enableEditing: false,
        enableSorting: false,
        size: 80,
      },
      {
        accessorKey: "ticker",
        header: "Ticker",
        size: 140,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
        }),
      },
      {
        accessorKey: "login",
        header: "Login",
        size: 140,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
        }),
      },
      {
        accessorKey: "precoMedio",
        header: "Preço Médio",
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
          type: "number",
        }),
      },
      {
        accessorKey: "precoTeto",
        header: "Preço Teto",
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
          type: "number",
        }),
      },
      {
        accessorKey: "precoAlvo",
        header: "Preço Alvo",
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
          type: "number",
        }),
      },
      {
        accessorKey: "quantidade",
        header: "Quantidade",
        size: 80,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
          type: "number",
        }),
      },
      {
        accessorKey: "percentualDesejado",
        header: "Percentual Desejado",
        size: 140,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
          type: "number",
        }),
      },
      {
        accessorKey: "valorTotal",
        header: "Valor Total",
        enableEditing: false,
        size: 140,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
          type: "number",
        }),
      },
    ],
    [getCommonEditTextFieldProps]
  );

  return (
    <>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="secondary" />
      </Backdrop>
      <MaterialReactTable
        displayColumnDefOptions={{
          "mrt-row-actions": {
            muiTableHeadCellProps: {
              align: "center",
            },
            size: 120,
          },
        }}
        columns={columns}
        data={tableData}
        editingMode="modal" //default
        enableColumnOrdering
        enableEditing
        onEditingRowSave={handleSaveRowEdits}
        onEditingRowCancel={handleCancelRowEdits}
        renderRowActions={({ row, table }) => (
          <Box sx={{ display: "flex", gap: "1rem" }}>
            <Tooltip arrow placement="left" title="Edit">
              <IconButton onClick={() => table.setEditingRow(row)}>
                <Edit />
              </IconButton>
            </Tooltip>
            <Tooltip arrow placement="right" title="Delete">
              <IconButton color="error" onClick={() => handleDeleteRow(row)}>
                <Delete />
              </IconButton>
            </Tooltip>
          </Box>
        )}
        renderTopToolbarCustomActions={() => (
          <Button
            color="secondary"
            onClick={() => setCreateModalOpen(true)}
            variant="contained"
          >
            Adicionar nova ação
          </Button>
        )}
      />
      <CriarNovaAcaoModal
        columns={columns}
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSubmit={handleCreateNewRow}
      />
    </>
  );
};

export const CriarNovaAcaoModal = ({ open, columns, onClose, onSubmit }) => {
  const [values, setValues] = useState(() =>
    columns.reduce((acc, column) => {
      acc[column.accessorKey ?? ""] = "";
      return acc;
    }, {})
  );

  const handleSubmit = () => {
    //put your validation logic here
    onSubmit(values);
    onClose();
  };

  return (
    <Dialog open={open}>
      <DialogTitle textAlign="center">Adicionar nova ação</DialogTitle>
      <DialogContent>
        <form onSubmit={(e) => e.preventDefault()}>
          <Stack
            sx={{
              width: "100%",
              minWidth: { xs: "300px", sm: "360px", md: "400px" },
              gap: "1.5rem",
            }}
          >
            {columns.map((column) => {
              if (
                column.accessorKey === "id" ||
                column.accessorKey === "login" ||
                column.accessorKey === "valorTotal"
              ) {
                return null;
              }

              return (
                <TextField
                  key={column.accessorKey}
                  label={column.header}
                  name={column.accessorKey}
                  onChange={(e) =>
                    setValues({ ...values, [e.target.name]: e.target.value })
                  }
                />
              );
            })}
          </Stack>
        </form>
      </DialogContent>
      <DialogActions sx={{ p: "1.25rem" }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button color="secondary" onClick={handleSubmit} variant="contained">
          Adicionar nova ação
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const validateRequired = (value) => !!value.length;
const validateEmail = (email) =>
  !!email.length &&
  email
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
const validateAge = (age) => age >= 18 && age <= 50;

export default MinhaCarteira;
