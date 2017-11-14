package com.tikal.fiscal.dao;

import java.util.List;

import com.tikal.fiscal.model.CuentaCliente;

public interface CuentaClienteDAO {
	
	public void save(CuentaCliente c);
	
	public CuentaCliente get(Long id);
	
	public void eliminar(CuentaCliente c);
	
	public List<CuentaCliente> getByCliente(Long idCliente);
	
	public CuentaCliente getByClabe(String clabe);
}
