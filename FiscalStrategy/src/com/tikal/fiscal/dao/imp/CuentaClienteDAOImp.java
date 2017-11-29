package com.tikal.fiscal.dao.imp;

import java.util.List;

import com.tikal.fiscal.dao.CuentaClienteDAO;
import com.tikal.fiscal.model.CuentaCliente;
import static com.googlecode.objectify.ObjectifyService.ofy;
public class CuentaClienteDAOImp implements CuentaClienteDAO{

	@Override
	public void save(CuentaCliente c) {
		ofy().save().entity(c).now();
	}

	@Override
	public CuentaCliente get(Long id) {
		return ofy().load().type(CuentaCliente.class).id(id).now();
	}

	@Override
	public List<CuentaCliente> getByCliente(Long idCliente) {
		return ofy().load().type(CuentaCliente.class).filter("id_cliente", idCliente).list();
	}

	@Override
	public CuentaCliente getByClabe(String clabe) {
		List<CuentaCliente> cuentas=ofy().load().type(CuentaCliente.class).filter("clabe", clabe).list();
		if(cuentas.size()>0){
			return cuentas.get(0);
		}
		return null;
	}

	@Override
	public void eliminar(CuentaCliente c) {
		ofy().delete().entities(c).now();
	}

}
