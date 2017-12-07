package com.tikal.fiscal.dao.imp;

import java.util.List;

import com.tikal.fiscal.dao.CuentaDAO;
import com.tikal.fiscal.model.Cuenta;
import static com.googlecode.objectify.ObjectifyService.ofy;

public class CuentaDAOImp implements CuentaDAO {

	@Override
	public void save(Cuenta c) {
		ofy().save().entity(c).now();
	}

	@Override
	public Cuenta get(Long id) {
		return ofy().load().type(Cuenta.class).id(id).now();
	}

	@Override
	public List<Cuenta> getPage(int page) {
		return ofy().load().type(Cuenta.class).offset(25*(page - 1)).limit(25).list();
	}

	@Override
	public List<Cuenta> getByCliente(Long idCliente, int page) {
		return ofy().load().type(Cuenta.class).filter("idCliente",idCliente).offset(25*(page - 1)).limit(25).list();
	}

	@Override
	public List<Cuenta> getByEjecutivo(Long idEjecutivo, int page) {
		return ofy().load().type(Cuenta.class).filter("idResponsable",idEjecutivo).offset(25*(page - 1)).limit(25).list();
	}

	@Override
	public void eliminar(Cuenta c) {
		c.setEnabled(false);
		this.save(c);
	}

	@Override
	public List<Cuenta> getByBanco(String banco) {
		return ofy().load().type(Cuenta.class).filter("banco",banco).list();
	}

}
