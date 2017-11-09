package com.tikal.fiscal.dao;

import java.util.List;

import com.tikal.fiscal.model.Cuenta;

public interface CuentaDAO {
	public void save(Cuenta c);
	
	public Cuenta get(Long id);
	
	public List<Cuenta> getPage(int page);
	
	public List<Cuenta> getByCliente(Long idCliente, int page);
	
	public List<Cuenta> getByEjecutivo(Long idEjecutivo, int page);
	
}
