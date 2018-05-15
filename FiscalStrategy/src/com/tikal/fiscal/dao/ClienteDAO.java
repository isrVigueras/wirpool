package com.tikal.fiscal.dao;

import java.util.List;

import com.tikal.fiscal.model.Cliente;

public interface ClienteDAO {

	public void save(Cliente c);
	
	public Cliente get(Long id);
	
	public List<Cliente> get(Long[] id);
	
	public List<Cliente> buscar(String nombre);
	
	public List<Cliente> buscarb(String nombre);
	
	public List<Cliente> getClientes(int page, String tipo);
	
	public List<Cliente> getAll();
	
	public void eliminar(Cliente c);
	
	public List<Cliente> getByBrocker(Long idbrocker);
	
	public List<Cliente> getTipo(String tipo);
	
	public int getPages(String tipo);
}
 