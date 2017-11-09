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
		List<Cliente> lista= ofy().load().type(Cliente.class).filter("nombre",nombre).list();
		return lista;
	}

	@Override
	public List<Cliente> getClientes(int page) {
		List<Cliente> lista= ofy().load().type(Cliente.class).offset(25*page).limit(25).list();
		return lista;
	}

}
