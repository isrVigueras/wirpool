package com.tikal.fiscal.dao;

import java.util.List;

import com.tikal.fiscal.model.RegistroPago;

public interface RegistroPagoDAO {
	
	public void save(RegistroPago p);
	
	public RegistroPago getPago(Long id);
	
	public List<RegistroPago> getPagos(int page);
	
	public void save(List<RegistroPago> pagos);

	public RegistroPago buscar(String ref);
	
	public List<RegistroPago> getPagosByOT(Long idOt);
	
	public int getPaginas();
}
