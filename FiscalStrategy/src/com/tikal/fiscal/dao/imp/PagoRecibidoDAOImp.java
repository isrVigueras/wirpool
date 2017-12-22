package com.tikal.fiscal.dao.imp;

import java.util.List;

import com.tikal.fiscal.dao.PagoRecibidoDAO;
import com.tikal.fiscal.model.PagoRecibido;
import static com.googlecode.objectify.ObjectifyService.ofy;

public class PagoRecibidoDAOImp implements PagoRecibidoDAO {

	@Override
	public void save(PagoRecibido p) {
		ofy().save().entity(p).now();
	}

	@Override
	public PagoRecibido getPago(Long id) {
		return ofy().load().type(PagoRecibido.class).id(id).now();
	}

	@Override
	public List<PagoRecibido> getPagos(int page) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public void save(List<PagoRecibido> pagos) {
		ofy().save().entities(pagos).now();
	}

}
