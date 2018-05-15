package com.tikal.fiscal.model;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import com.googlecode.objectify.annotation.Entity;
import com.googlecode.objectify.annotation.Id;
import com.googlecode.objectify.annotation.Index;

@Entity
public class OrdenDeTrabajo {
	
	@Id
	private Long id;
	@Index
	private Long idResponsable;
	@Index
	private Long idCliente;
	private List<Long> comisiones;
	private float saldoMov;
	private float resguardo;
	
	@Index
	private Long idBrocker;
	private List<Long> movimientos;
	private float saldoCom;
	@Index
	private Date fechaInicio;
	@Index
	private Date fechaCierre;
	@Index
	private String tipo;
	@Index
	private Long idPago;
	@Index
	private String estatus;
	
	private String nombreCliente;
	
	private Long[] listaBrockers;
	
	private float porLic;
	private float[] porBrok;
	private float porDes;
	
	private float montoLic;
	private float montoDes;
	private float []montoBrok;
	
	private float importe;
	private float iva;
	private float total;
	private float porciento;
	
	private float retorno;
	private float totalComisiones;
	
	private int folioImpresion;
	private float baseComisiones;
	
	private String tipoOP;
	
	public float getSaldoMov() {
		return saldoMov;
	}
	public void setSaldoMov(float saldoMov) {
		this.saldoMov = saldoMov;
	}
	public float getSaldoCom() {
		return saldoCom;
	}
	public void setSaldoCom(float saldoCom) {
		this.saldoCom = saldoCom;
	}
	public float getRetorno() {
		return retorno;
	}
	public void setRetorno(float retorno) {
		this.retorno = retorno;
	}
	public float getMontoLic() {
		return montoLic;
	}
	public void setMontoLic(float montoLic) {
		this.montoLic = montoLic;
	}
	public float getMontoDes() {
		return montoDes;
	}
	public void setMontoDes(float montoDes) {
		this.montoDes = montoDes;
	}
	public float[] getMontoBrok() {
		return montoBrok;
	}
	public void setMontoBrok(float[] montoBrok) {
		this.montoBrok = montoBrok;
	}
	public float getImporte() {
		return importe;
	}
	public void setImporte(float importe) {
		this.importe = importe;
	}
	public float getTotal() {
		return total;
	}
	public void setTotal(float total) {
		this.total = total;
	}
	public void setPorBrok(float[] porBrok) {
		this.porBrok = porBrok;
	}
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public Long getIdResponsable() {
		return idResponsable;
	}
	public void setIdResponsable(Long idResponsable) {
		this.idResponsable = idResponsable;
	}
	public Long getIdCliente() {
		return idCliente;
	}
	public void setIdCliente(Long idCliente) {
		this.idCliente = idCliente;
	}

	public float getResguardo() {
		return resguardo;
	}
	public void setResguardo(float resguardo) {
		this.resguardo = resguardo;
	}
	public Long getIdBrocker() {
		return idBrocker;
	}
	public void setIdBrocker(Long idBrocker) {
		this.idBrocker = idBrocker;
	}
	
	public Date getFechaInicio() {
		return fechaInicio;
	}
	public void setFechaInicio(Date fechaInicio) {
		this.fechaInicio = fechaInicio;
	}
	public Date getFechaCierre() {
		return fechaCierre;
	}
	public void setFechaCierre(Date fechaCierre) {
		this.fechaCierre = fechaCierre;
	}
	public String getTipo() {
		return tipo;
	}
	public void setTipo(String tipo) {
		this.tipo = tipo;
	}
	public Long getIdPago() {
		return idPago;
	}
	public void setIdPago(Long idPago) {
		this.idPago = idPago;
	}
	public String getEstatus() {
		return estatus;
	}
	public void setEstatus(String estatus) {
		this.estatus = estatus;
	}
	public String getNombreCliente() {
		return nombreCliente;
	}
	public void setNombreCliente(String nombreCliente) {
		this.nombreCliente = nombreCliente;
	}
	public float getPorLic() {
		return porLic;
	}
	public void setPorLic(float porLic) {
		this.porLic = porLic;
	}

	public float[] getPorBrok() {
		return porBrok;
	}
	public float getPorDes() {
		return porDes;
	}
	public void setPorDes(float porDes) {
		this.porDes = porDes;
	}
	public List<Long> getComisiones() {
		if(this.comisiones==null){
			this.comisiones= new ArrayList<Long>();
		}
		return comisiones;
	}
	public void setComisiones(List<Long> comisiones) {
		this.comisiones = comisiones;
	}
	public List<Long> getMovimientos() {
		if(this.movimientos==null){
			this.movimientos= new ArrayList<Long>();
		}
		return movimientos;
	}
	public void setMovimientos(List<Long> movimientos) {
		this.movimientos = movimientos;
	}
	public float getIva() {
		return iva;
	}
	public void setIva(float iva) {
		this.iva = iva;
	}
	public float getTotalComisiones() {
		return totalComisiones;
	}
	public void setTotalComisiones(float totalComisiones) {
		this.totalComisiones = totalComisiones;
	}
	public int getFolioImpresion() {
		return folioImpresion;
	}
	public void setFolioImpresion(int folioImpresion) {
		this.folioImpresion = folioImpresion;
	}
	public float getPorciento() {
		return porciento;
	}
	public void setPorciento(float porciento) {
		this.porciento = porciento;
	}
	public String getTipoOP() {
		return tipoOP;
	}
	public void setTipoOP(String tipoOP) {
		this.tipoOP = tipoOP;
	}
	public float getBaseComisiones() {
		return baseComisiones;
	}
	public void setBaseComisiones(float baseComisiones) {
		this.baseComisiones = baseComisiones;
	}
	public Long[] getListaBrockers() {
		return listaBrockers;
	}
	public void setListaBrockers(Long[] listaBrockers) {
		this.listaBrockers = listaBrockers;
	}
	
}
