package com.tikal.fiscal.dao.imp;

import java.util.List;

import com.tikal.fiscal.dao.ClienteDAO;
import com.tikal.fiscal.model.Cliente;
import static com.googlecode.objectify.ObjectifyService.ofy;

public class ClienteDAOImp implements ClienteDAO{

	@Override
	public void save(Cliente c) {
		ofy().save().entity(c).now();
	}

	@Override
	public Cliente get(Long id) {
		return ofy().load().type(Cliente.class).id(id).now();
	}

	@Override
	public List<Cliente> buscar(String nombre) {
		List<Cliente> lista= ofy().load().type(Cliente.class).filter("enabled",true).filter("nombre",nombre).list();
		return lista;
	}

	@Override
	public List<Cliente> getClientes(int page, String tipo) {
		List<Cliente> lista= ofy().load().type(Cliente.class).filter("enabled",true).filter("tipo",tipo).offset(25*(page-1)).limit(25).list();
		return lista;
	}

	@Override
	public void eliminar(Cliente c) { 
		c.setEnabled(false);
		this.save(c);
	}

	@Override
	public List<Cliente> getByBrocker(Long idbrocker) {
		List<Cliente> lista= ofy().load().type(Cliente.class).filter("enabled",true).filter("tipo","cliente").filter("idBrocker",idbrocker).list();
		return lista;
	}

	@Override
	public List<Cliente> getTipo(String tipo) {
		List<Cliente> lista= ofy().load().type(Cliente.class).filter("enabled",true).filter("tipo", tipo).list();
		return lista;
	}

	@Override
	public List<Cliente> getAll() {
		List<Cliente> lista= ofy().load().type(Cliente.class).filter("enabled",true).list();
		return lista;
	}

}
