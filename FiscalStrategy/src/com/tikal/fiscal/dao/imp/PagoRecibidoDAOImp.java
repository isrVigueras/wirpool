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
		return ofy().load().type(PagoRecibido.class).offset((page-1)*25).limit(25).list();
	}

	@Override
	public void save(List<PagoRecibido> pagos) {
		ofy().save().entities(pagos).now();
	}

	@Override
	public PagoRecibido buscar(String ref) {
		List<PagoRecibido> lista= ofy().load().type(PagoRecibido.class).filter("referencia",ref).list();
		if(lista.size()==0){
			return null;
		}else{
			return lista.get(0);
		}
	}

	@Override
	public List<PagoRecibido> getPagosByOT(Long idOt) {
		return ofy().load().type(PagoRecibido.class).filter("ot", idOt).list();
	}

	@Override
	public void eliminar(Long idPago) {
		ofy().delete().type(PagoRecibido.class).id(idPago).now();
	}

}
