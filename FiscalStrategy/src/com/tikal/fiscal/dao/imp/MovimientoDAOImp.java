package com.tikal.fiscal.dao.imp;

import static com.googlecode.objectify.ObjectifyService.ofy;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import com.tikal.fiscal.dao.MovimientoDAO;
import com.tikal.fiscal.model.Movimiento;
import com.tikal.fiscal.model.OrdenDeTrabajo;

public class MovimientoDAOImp implements MovimientoDAO {

	@Override
	public void save(Movimiento m) {
		ofy().save().entity(m).now();  
	}

	@Override
	public Movimiento get(Long id) {
		return ofy().load().type(Movimiento.class).id(id).now();
	}

	@Override
	public List<Movimiento> getByOT(Long idOt) {
		return ofy().load().type(Movimiento.class).filter("ot", idOt).list();
	}

	@Override
	public List<Movimiento> getByIds(List<Long> ids) {
		List<Movimiento> m = new ArrayList<Movimiento>();
		m.addAll(ofy().load().type(Movimiento.class).ids(ids).values());
		return m;
	}


	@Override
	public List<Movimiento> getFull(int page, String tipo) {
		return ofy().load().type(Movimiento.class).filter("tipo",tipo).offset(25 * (page - 1)).order("- fechaCreacion").limit(25).list();
	}

	@Override
	public int getPages(Long id) {
		int pages = 0;
		if (id != null) {
			pages = ofy().load().type(Movimiento.class).filter("id_cuenta", id).list().size();

		} else {
			pages = ofy().load().type(Movimiento.class).list().size();
		}
		pages = pages / 25;
		pages++;
		return pages;
	}

	@Override
	public int numPages() {
		int pages=ofy().load().type(Movimiento.class).list().size();
		pages = pages / 25;
		pages++;
		return pages;
	}

	@Override
	public List<Movimiento> getPage(int page) {
		return ofy().load().type(Movimiento.class).order("- fechaCreacion").offset(25 * (page - 1)).limit(25).list();
	}

	@Override
	public List<Movimiento> getResguardos(Long id) {
		return ofy().load().type(Movimiento.class).filter("resguardo", true).filter("idCliente", id).order("- fechaCreacion").list();
	}

	@Override
	public List<Movimiento> getResguardosFechas(Date finicio, Date fFinal) {
		return ofy().load().type(Movimiento.class).order("- fechaCreacion").filter("fechaCreacion <=", fFinal).filter("fechaCreacion >=", finicio).list();
	}

	@Override
	public int getPagesCliente(Long id) {
		int pages = 0;
		if (id != null) {
			pages = ofy().load().type(Movimiento.class).filter("idCliente", id).list().size();

		} else {
			pages = ofy().load().type(Movimiento.class).list().size();
		}
		pages = pages / 25;
		pages++;
		return pages;
	}

	@Override
	public List<Movimiento> getPageByCliente(Long idCliente, int page) {
		return ofy().load().type(Movimiento.class).filter("idCliente", idCliente).order("- fechaCreacion").offset(25 * (page - 1)).limit(25).list();
	}

	@Override
	public List<Movimiento> getPageByEmpresa(String empresa, int page) {
		return ofy().load().type(Movimiento.class).filter("empresa", empresa).order("- fechaCreacion").offset(25 * (page - 1)).limit(25).list();
	}

	@Override
	public int getPagesEmpresa(String empresa) {
		int pages = 0;
		pages = ofy().load().type(Movimiento.class).filter("empresa", empresa).list().size();
		pages = pages / 25;
		pages++;
		return pages;
	}

	
}
 