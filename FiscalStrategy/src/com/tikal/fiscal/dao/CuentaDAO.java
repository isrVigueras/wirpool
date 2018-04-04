package com.tikal.fiscal.dao;

import java.util.List;

import com.tikal.fiscal.model.Cuenta;

public interface CuentaDAO {
	public void save(Cuenta c);
	
	public Cuenta get(Long id);
	
	public void eliminar(Cuenta c);
	
	public List<Cuenta> getPage(int page);
	
	public int getNumPages();
	
	public List<Cuenta> getByCliente(Long idCliente, int page);
	
	public List<Cuenta> getByEjecutivo(Long idEjecutivo, int page);
	
	public List<Cuenta> getByBanco(String banco);
	
	public List<Cuenta> getByCuenta(String cuenta);
	
	public List<Cuenta> getByEmpresa(Long idEmpresa);
	
}
