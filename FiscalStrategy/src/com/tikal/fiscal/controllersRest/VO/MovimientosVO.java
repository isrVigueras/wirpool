package com.tikal.fiscal.controllersRest.VO;

import com.tikal.fiscal.model.Movimiento;

public class MovimientosVO {
	private Movimiento movimiento;
	private Long idOt;
	private String bndMovimiento;
	private Float saldo;
	
	
	public Movimiento getMovimiento() {
		return movimiento;
	}
	public void setMovimiento(Movimiento movimiento) {
		this.movimiento = movimiento;
	}
	public Long getIdOt() {
		return idOt;
	}
	public void setIdOt(Long idOt) {
		this.idOt = idOt;
	}
	public String getBndMovimiento() {
		return bndMovimiento;
	}
	public void setBndMovimiento(String bndMovimiento) {
		this.bndMovimiento = bndMovimiento;
	}
	public Float getSaldo() {
		return saldo;
	}
	public void setSaldo(Float saldo) {
		this.saldo = saldo;
	}
	
	

}
