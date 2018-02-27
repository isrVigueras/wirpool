package com.tikal.fiscal.dao.imp;

import static com.googlecode.objectify.ObjectifyService.ofy;
import java.util.List;
import com.tikal.fiscal.dao.NotificacionDAO;
import com.tikal.fiscal.model.Notificacion;

public class NotificacionDAOImp implements NotificacionDAO{

	@Override
	public void save(Notificacion Notificacion) {
		ofy().save().entity(Notificacion).now();
	}

	@Override
	public Notificacion getByID(Long id) {
		return ofy().load().type(Notificacion.class).id(id).now();
	}

	@Override
	public List<Notificacion> getByOT(Long id) {
		return ofy().load().type(Notificacion.class).filter("idOt",id).list();
	}

	@Override
	public List<Notificacion> getByResponsable(Long id) {
		return ofy().load().type(Notificacion.class).filter("responsable",id).list();
	}

	@Override
	public void eliminarVarias(List<Notificacion> notificaciones) {
		ofy().delete().entities(notificaciones).now();
	}
	
	@Override
	public void eliminar(Notificacion notificacion) {
		ofy().delete().entities(notificacion).now();
	}

}
