package com.tikal.fiscal.dao;

import java.util.List;

import com.tikal.fiscal.model.Cliente;

public interface ClienteDAO {

	public void save(Cliente c);
	
	public Cliente get(Long id);
	
	public List<Cliente> buscar(String nombre);
	
	public List<Cliente> getClientes(int page);
	
	public void eliminar(Cliente c);
}
