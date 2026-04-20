import React, { useState, useEffect } from 'react';
import { FormControl, InputLabel, Select, MenuItem, TextField, Grid } from '@mui/material';
import api from '../services/api';

export function UFSelector({ value, onChange, required }) {
  const [ufs, setUfs] = useState([]);
  
  useEffect(() => {
    api.get('/regioes/ufs').then(res => setUfs(res.data)).catch(() => {});
  }, []);

  return (
    <FormControl fullWidth required={required}>
      <InputLabel>Estado (UF)</InputLabel>
      <Select value={value || ''} label="Estado (UF)" onChange={(e) => onChange(e.target.value)}>
        {ufs.map(uf => (
          <MenuItem key={uf.id} value={uf.id}>{uf.sigla} - {uf.nome}</MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export function CidadeSelector({ ufId, value, onChange, required }) {
  const [cidades, setCidades] = useState([]);
  
  useEffect(() => {
    if (ufId) {
      api.get(`/regioes/cidades/${ufId}`).then(res => setCidades(res.data)).catch(() => {});
    } else {
      setCidades([]);
    }
  }, [ufId]);

  return (
    <FormControl fullWidth required={required} disabled={!ufId}>
      <InputLabel>Cidade</InputLabel>
      <Select value={value || ''} label="Cidade" onChange={(e) => onChange(e.target.value)}>
        {cidades.map(c => (
          <MenuItem key={c.id} value={c.id}>{c.nome}</MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export function RegiaoSelector({ cidadeId, value, onChange, required }) {
  const [regioes, setRegioes] = useState([]);
  
  useEffect(() => {
    if (cidadeId) {
      api.get(`/regioes?cidade_id=${cidadeId}`).then(res => setRegioes(res.data)).catch(() => {});
    } else {
      setRegioes([]);
    }
  }, [cidadeId]);

  return (
    <FormControl fullWidth required={required} disabled={!cidadeId}>
      <InputLabel>Região</InputLabel>
      <Select value={value || ''} label="Região" onChange={(e) => onChange(e.target.value)}>
        {regioes.map(r => (
          <MenuItem key={r.id} value={r.id}>{r.nome}</MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export function AgrupamentoSelector({ value, onChange, required }) {
  const [agrupamentos, setAgrupamentos] = useState([]);
  
  useEffect(() => {
    api.get('/agrupamentos').then(res => setAgrupamentos(res.data)).catch(() => {});
  }, []);

  return (
    <FormControl fullWidth required={required}>
      <InputLabel>Agrupamento</InputLabel>
      <Select value={value || ''} label="Agrupamento" onChange={(e) => onChange(e.target.value)}>
        <MenuItem value=""><em>Nenhum</em></MenuItem>
        {agrupamentos.map(a => (
          <MenuItem key={a.id} value={a.id}>{a.nome}</MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export function PapelSelector({ value, onChange, required }) {
  const [papeis, setPapeis] = useState([]);
  
  useEffect(() => {
    api.get('/papeis').then(res => setPapeis(res.data)).catch(() => {});
  }, []);

  return (
    <FormControl fullWidth required={required}>
      <InputLabel>Papel</InputLabel>
      <Select value={value || ''} label="Papel" onChange={(e) => onChange(e.target.value)}>
        {papeis.map(p => (
          <MenuItem key={p.id} value={p.id}>{p.papel}</MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export function PessoaSelector({ value, onChange, required, label }) {
  const [pessoas, setPessoas] = useState([]);
  
  useEffect(() => {
    api.get('/pessoas').then(res => setPessoas(res.data)).catch(() => {});
  }, []);

  return (
    <FormControl fullWidth required={required}>
      <InputLabel>{label || 'Pessoa'}</InputLabel>
      <Select value={value || ''} label={label || 'Pessoa'} onChange={(e) => onChange(e.target.value)}>
        <MenuItem value=""><em>Selecione...</em></MenuItem>
        {pessoas.map(p => (
          <MenuItem key={p.id} value={p.id}>{p.nome}</MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}