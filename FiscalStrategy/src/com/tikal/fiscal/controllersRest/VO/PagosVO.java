package com.tikal.fiscal.controllersRest.VO;

import java.util.List;

import com.tikal.fiscal.model.PagoRecibido;

public class PagosVO {
	private List<PagoRecibido> pagos;

	public List<PagoRecibido> getPagos() {
		return pagos;
	}

	public void setPagos(List<PagoRecibido> pagos) {
		this.pagos = pagos;
	}
}
