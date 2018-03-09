package com.tikal.fiscal.dao.imp;

import static com.googlecode.objectify.ObjectifyService.ofy;

import java.util.List;

import com.tikal.fiscal.dao.RegistroPagoDAO;
import com.tikal.fiscal.model.RegistroPago;

public class RegistroPagoDAOImp implements RegistroPagoDAO {

	@Override
	public void save(RegistroPago p) {
		ofy().save().entity(p).now();
	}

	@Override
	public RegistroPago getPago(Long id) {
		return ofy().load().type(RegistroPago.class).id(id).now();
	}

	@Override
	public List<RegistroPago> getPagos(int page) {
		return ofy().load().type(RegistroPago.class).offset((page-1)*25).limit(25).list();
	}

	@Override
	public void save(List<RegistroPago> pagos) {
		ofy().save().entities(pagos).now();
	}

	@Override
	public RegistroPago buscar(String ref) {
		List<RegistroPago> lista= ofy().load().type(RegistroPago.class).filter("referencia",ref).list();
		if(lista.size()==0){
			return null;
		}else{
			return lista.get(0);
		}
	}

	@Override
	public List<RegistroPago> getPagosByOT(Long idOt) {
		return ofy().load().type(RegistroPago.class).filter("ot", idOt).list();
	}

	@Override
	public int getPaginas() {
		return ((ofy().load().type(RegistroPago.class).count()-1)/25)+1;
	}

}
