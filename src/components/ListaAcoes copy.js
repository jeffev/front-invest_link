import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DataGrid, ptBR } from '@mui/x-data-grid';
import ToolbarCompleta from './ToolbarCompleta';

const columns = [
  { field: 'ticker', headerName: 'Ticker', width: 80 },
  { field: 'preco', headerName: 'Preço', width: 80 },
  { field: 'roe', headerName: 'Roe', width: 75 },
  { field: 'dy', headerName: 'DY', width: 80 },
  { field: 'pvp', headerName: 'PVP', width: 75 },
  { field: 'vpa', headerName: 'VPA', width: 85 },
  { field: 'lpa', headerName: 'LPA', width: 85 },
  { field: 'pl', headerName: 'PL', width: 75 },
  { field: 'liquidez', headerName: 'Liquidez', width: 140 },
  { field: 'rankRoe', headerName: 'Rank Roe', width: 75 },
  { field: 'rankPl', headerName: 'Rank Pl', width: 75 },
  { field: 'somaFormula', headerName: 'Soma Ranks', width: 85 },
  { field: 'valorFormulaGrham', headerName: 'Formula Grham', width: 110 },
  { field: 'descontoFormulaGrham', headerName: 'Desconto Formula Grham', width: 130 }
]

function ListaAcoes() {
  const [lista, setLista] = useState([]);
  const [height, setHeight] = useState(window.innerHeight);

  useEffect(() => {
    function handleResize() {
      setHeight(window.innerHeight);
    }

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    axios.get('http://localhost:8080/api/v1/acoes/')
      .then(response => {
        setLista(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  return (
    <div style={{ height: `${height}px` }}>
      <DataGrid
        localeText={ptBR.components.MuiDataGrid.defaultProps.localeText} 
        density='compact'
        rows={lista}
        columns={columns}
        getRowId={(row) => row.ticker}
        slots={{
          toolbar: ToolbarCompleta,
        }}
      />
    </div>
  );
}

export default ListaAcoes;
