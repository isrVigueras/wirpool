package com.tikal.fiscal.dao;

import java.util.List;

import com.tikal.fiscal.model.Notificacion;

public interface NotificacionDAO {

	public void save (Notificacion notificacion);
	
	public Notificacion getByID (Long id);
	
	public List<Notificacion> getByOT (Long id);
	
	public List<Notificacion> getByResponsable (Long id);
	
	public void eliminarVarias(List<Notificacion> notificaciones);
	
	public void eliminar(Notificacion notificacion);

}
