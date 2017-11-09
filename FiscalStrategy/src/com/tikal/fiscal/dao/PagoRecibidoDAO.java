package com.tikal.fiscal.dao;

import java.util.List;

import com.tikal.fiscal.model.PagoRecibido;

public interface PagoRecibidoDAO {
	
	public void save(PagoRecibido p);
	
	public void getPago(Long id);
	
	public List<PagoRecibido> getPagos(int page);
	
	public void save(List<PagoRecibido> pagos);

}
