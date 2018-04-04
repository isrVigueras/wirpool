package com.tikal.fiscal.controllersRest.VO;

import java.util.List;

import com.tikal.fiscal.model.Cuenta;
import com.tikal.fiscal.model.Empresa;

public class EmpresaCuentasVO {
	private Empresa empresa;
	
	private List<Cuenta> cuentas;

	public Empresa getEmpresa() {
		return empresa;
	}

	public void setEmpresa(Empresa empresa) {
		this.empresa = empresa;
	}

	public List<Cuenta> getCuentas() {
		return cuentas;
	}

	public void setCuentas(List<Cuenta> cuentas) {
		this.cuentas = cuentas;
	}
	
	

}
