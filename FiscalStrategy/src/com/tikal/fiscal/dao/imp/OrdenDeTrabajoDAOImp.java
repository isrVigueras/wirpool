package com.tikal.fiscal.dao.imp;

import static com.googlecode.objectify.ObjectifyService.ofy;

import java.util.Date;
import java.util.List;

import com.tikal.fiscal.dao.OrdenDeTrabajoDAO;
import com.tikal.fiscal.model.OrdenDeTrabajo;

public class OrdenDeTrabajoDAOImp implements OrdenDeTrabajoDAO {

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
		return ofy().load().type(OrdenDeTrabajo.class).filter("idCliente", id).order("- fechaInicio").offset(25 * (page - 1)).limit(25).list();
	}
	
	@Override
	public List<OrdenDeTrabajo> getByCliente(Long id) {
		return ofy().load().type(OrdenDeTrabajo.class).filter("idCliente", id).order("- fechaInicio").list();
	}

	@Override
	public List<OrdenDeTrabajo> getByResponsable(Long id, int page) {
		return ofy().load().type(OrdenDeTrabajo.class).filter("idResponsable", id).order("- fechaInicio").offset(25 * (page - 1)).limit(25)
				.list();
	}

	@Override
	public int getPages(Long id) {
		int pages = 0;
		if (id != null) {
			pages = ofy().load().type(OrdenDeTrabajo.class).filter("idResponsable", id).list().size();

		} else {
			pages = ofy().load().type(OrdenDeTrabajo.class).list().size();
		}
		pages = pages / 25;
		pages++;
		return pages;
	}

	@Override
	public void save(List<OrdenDeTrabajo> ots) {
		ofy().save().entities(ots);
	}

	@Override
	public List<OrdenDeTrabajo> getFull(int page) {
		return ofy().load().type(OrdenDeTrabajo.class).offset(25 * (page - 1)).order("- fechaInicio").limit(25).list();
	}

	@Override
	public List<OrdenDeTrabajo> getFecha(Date fechaInicio, Date fechaFin) {
		return ofy().load().type(OrdenDeTrabajo.class).filter("fechaInicio >", fechaInicio).filter("fechaInicio <", fechaFin).order("- fechaInicio").list();
	}

	@Override
	public List<OrdenDeTrabajo> getFechaCliente(Date fechaInicio, Date fechaFin, Long id) {
		
		return ofy().load().type(OrdenDeTrabajo.class).filter("idCliente", id).order("- fechaInicio").filter("fechaInicio >=", fechaInicio).filter("fechaInicio <=", fechaFin).list();
	}

	@Override
	public List<OrdenDeTrabajo> getClienteCA(Long id) {
//		List<OrdenDeTrabajo> lista=ofy().load().type(OrdenDeTrabajo.class).filter("idCliente", id).list();
//		for(OrdenDeTrabajo ot:lista){
//			System.out.println(ot.getImporte());
//		}
//		
//		lista=ofy().load().type(OrdenDeTrabajo.class).filter("idCliente", id).filter("tipo", "CA").list();
//		for(OrdenDeTrabajo ot:lista){
//			System.out.println(ot.getImporte());
//		}
//		
		
		return ofy().load().type(OrdenDeTrabajo.class).filter("idCliente", id).filter("tipo", "ca").order("- fechaInicio").list();
	}

}
