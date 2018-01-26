package com.tikal.fiscal.dao.imp;

import static com.googlecode.objectify.ObjectifyService.ofy;

import java.util.ArrayList;
import java.util.List;

import com.tikal.fiscal.dao.MovimientoDAO;
import com.tikal.fiscal.model.Movimiento;

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

}
