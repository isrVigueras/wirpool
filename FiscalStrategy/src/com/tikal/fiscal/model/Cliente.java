package com.tikal.fiscal.model;

import com.googlecode.objectify.annotation.Entity;
import com.googlecode.objectify.annotation.Id;
import com.googlecode.objectify.annotation.Index;

@Entity
public class Cliente {
	@Id private Long id;
	
	@Index private String nickname;
	@Index
	private String tipo;
	@Index private Long responsable;
	@Index private Long idBrocker; 
	@Index private boolean enabled;
	private double saldo;
	private double saldoUSD;
	
	private String nombre;
	private String apeMaterno;
	private String apePaterno;
	
	public Long getResponsable() {
		return responsable;
	}
	public void setResponsable(Long responsable) {
		this.responsable = responsable;
	}
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public String getNickname() {
		return nickname;
	}
	public void setNickname(String nickname) {
		this.nickname = nickname;
	}
	public String getTipo() {
		return tipo;
	}
	public void setTipo(String tipo) {
		this.tipo = tipo;
	}
	public Long getIdBrocker() {
		return idBrocker;
	}
	public void setIdBrocker(Long idBrocker) {
		this.idBrocker = idBrocker;
	}
	public boolean isEnabled() {
		return enabled;
	}
	public void setEnabled(boolean enabled) {
		this.enabled = enabled;
	}
	public double getSaldo() {
		return saldo;
	}
	public void setSaldo(double saldo) {
		this.saldo = saldo;
	}
	public String getNombre() {
		return nombre;
	}
	public void setNombre(String nombre) {
		this.nombre = nombre;
	}
	public String getApeMaterno() {
		return apeMaterno;
	}
	public void setApeMaterno(String apeMaterno) {
		this.apeMaterno = apeMaterno;
	}
	public String getApePaterno() {
		return apePaterno;
	}
	public void setApePaterno(String apePaterno) {
		this.apePaterno = apePaterno;
	}
	public double getSaldoUSD() {
		return saldoUSD;
	}
	public void setSaldoUSD(double saldoUSD) {
		this.saldoUSD = saldoUSD;
	}
	
}
