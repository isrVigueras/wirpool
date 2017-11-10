package com.tikal.fiscal.dao.imp;

import java.util.List;

import com.tikal.fiscal.dao.OrdenDeTrabajoDAO;
import com.tikal.fiscal.model.OrdenDeTrabajo;
import static com.googlecode.objectify.ObjectifyService.ofy;

public class OrdenDeTrabajoDAOImp implements OrdenDeTrabajoDAO{

	@Override
	public void save(OrdenDeTrabajo ot) {
		ofy().save().entity(ot).now();
	}

	@Override
	public OrdenDeTrabajo get(Long id) {
		return ofy().load().type(OrdenDeTrabajo.class).id(id).now();
	}

	@Override
	public List<OrdenDeTrabajo> getByCliente(Long id, int page) {
		return ofy().load().type(OrdenDeTrabajo.class).filter("idCliente",id).offset(25*(page-1)).limit(25).list();
	}

	@Override
	public List<OrdenDeTrabajo> getByResponsable(Long id, int page) {
		return ofy().load().type(OrdenDeTrabajo.class).filter("idResponsable",id).offset(25*(page-1)).limit(25).list();
	}

	@Override
	public List<OrdenDeTrabajo> getPage(int page) {
		return ofy().load().type(OrdenDeTrabajo.class).offset(25*(page-1)).limit(25).list();
	}

	@Override
	public void save(List<OrdenDeTrabajo> ots) {
		ofy().save().entities(ots);
	}

}
