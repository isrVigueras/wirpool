package com.tikal.fiscal.service;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import com.tikal.fiscal.model.PagoRecibido;
import com.tikal.fiscal.model.RegistroPago;

public class ParseadorDePagos {
	public static List<RegistroPago>parsear(String info, String tipo,String cuenta){
		List<RegistroPago> lista= new ArrayList<RegistroPago>();
		switch(tipo){
		case "Banco Mercantil del Norte (Banorte)":{
			lista= ParseadorDePagos.parseaBanorte(info);
			break;
		}
		case "MultivaNet":{
			lista= ParseadorDePagos.parseaMultiva(info, cuenta);
			break;
		}
		case "Scotiabank Inverlat":{
			lista= ParseadorDePagos.parseaScotia(info,cuenta);
			break;
		}
		case "HSBC México":{
			lista= ParseadorDePagos.parseaHsbc(info, cuenta);
			break;
		}
		case "BBVA Bancomer":{
			lista= ParseadorDePagos.parseaBBVA(info, cuenta);
			break;
		}
		case "Banco del Bajio":{
			lista = ParseadorDePagos.parseaBajio(info, cuenta);
			break;
		}
		case "Banco Santander (México)":{
			lista = ParseadorDePagos.parseaSantander(info, cuenta);
			break;
		}
		case "Banco Nacional de México":{
			lista = ParseadorDePagos.parseaBanamex(info, cuenta);
			break;
		}
		
		}
		
		return lista;
	}
	
	private static List<RegistroPago> parseaBanamex(String info, String cuenta){
		List<RegistroPago> lista= new ArrayList<RegistroPago>();
		String[] rengs= info.split("\n");
		for(String reng:rengs){
			reng= reng.replace("\"\t", "");
			String[] values= reng.split("\t");
			RegistroPago p= new RegistroPago();
			if(values[2].compareTo("-")!=0){
				float monto= Float.parseFloat(values[2].trim());
				p.setBanco("Banco Nacional de México");
				p.setCuenta(cuenta);
				p.setDescripcion(values[1].trim());
				p.setMoneda("MXN");
				p.setMonto(monto);
				DateFormat format = new SimpleDateFormat("dd/MM/yyyy");
				Date d;
				try {
					d = format.parse(values[0].trim());
					p.setFecha(d);
				} catch (ParseException e) {
				}
				lista.add(p);
			}
		}
		
		return lista;
	}
	
	private static List<RegistroPago> parseaSantander(String info, String cuenta){
		List<RegistroPago> lista= new ArrayList<RegistroPago>();
		String[] rengs= info.split("\n");
		for(String reng:rengs){
			reng= reng.replace("\"\t", "");
			String[] values= reng.split("\t");
			RegistroPago p= new RegistroPago();
			if(values[5].trim().compareTo("+")== 0){
				p.setCuenta(cuenta);
				p.setBanco("Banco Santander (México)");
				p.setMonto(Float.parseFloat(values[6].trim()));
				p.setReferencia(values[8].trim());
				String fecha= values[1].substring(4)+"/"+values[0].substring(2, 4)+"/"+values[0].substring(0,2);
				DateFormat format = new SimpleDateFormat("yyyy/MM/dd");
				Date d;
				try {
					d = format.parse(fecha);
					p.setFecha(d);
				} catch (ParseException e) {
				}
				lista.add(p);
				
			}
		}
		
		return lista;
	}
	
	private static List<RegistroPago> parseaBajio(String info, String cuenta){
		List<RegistroPago> lista= new ArrayList<RegistroPago>();
		String[] rengs= info.split("\n");
		for(String reng:rengs){
			String[] values= reng.split("\t");
			RegistroPago p= new RegistroPago();
			if(!values[5].trim().isEmpty()){
				String monto = values[5].trim();
				float montof= Float.parseFloat(monto);
				if(montof>0){
					p.setBanco("Banco del Bajio");
					p.setCuenta(cuenta);
					p.setMonto(montof);
					p.setReferencia(values[1]);
					p.setDescripcion(values[2]);
					String fecha= values[0].substring(0,4)+"/"+values[0].substring(4, 6)+"/"+values[0].substring(6);
					DateFormat format = new SimpleDateFormat("yyyy/MM/dd");
					Date d;
					try {
						d = format.parse(fecha);
						p.setFecha(d);
					} catch (ParseException e) {
					}
					lista.add(p);
				}
			}
		}
		
		return lista;
	}
	
	private static List<RegistroPago> parseaBBVA(String info, String cuenta){
		List<RegistroPago> lista= new ArrayList<RegistroPago>();
		String[] rengs= info.split("\n");
		for(String reng:rengs){
			String[] values= reng.split("\t");
			RegistroPago p= new RegistroPago();
			if(!values[3].trim().isEmpty()){
				String monto = values[3].trim();
				monto=monto.replaceAll(",", "");
//				monto.replaceAll(, replacement)
				p.setMonto(Float.parseFloat(monto));
				p.setCuenta(cuenta);
				String referencia="";
				if(values[1].trim().contains("BNET")){
					referencia= values[1].trim().split("BNET")[1];
					referencia= referencia.trim();
					p.setReferencia(referencia);
				}
				p.setBanco("BBVA Bancomer");
				p.setDescripcion(values[1]);
				DateFormat format = new SimpleDateFormat("dd/MM/yyyy");
				Date d;
				try {
					d = format.parse(values[0].trim());
					p.setFecha(d);
				} catch (ParseException e) {
				}
				lista.add(p);	
			}
		}
		
		return lista;
	}
	
	private static List<RegistroPago> parseaHsbc(String info, String cuenta){
		List<RegistroPago> lista= new ArrayList<RegistroPago>();
		String[] rengs= info.split("\n");
		for(String reng:rengs){
			String[] values= reng.split("\t");
			RegistroPago p= new RegistroPago();
			if(!values[11].trim().isEmpty()){
				float monto = Float.parseFloat(values[11].trim());
				p.setMonto(monto);
				p.setMoneda(values[3].trim());
				p.setReferencia(values[9].trim());
				DateFormat format = new SimpleDateFormat("dd/MM/yyyy");
				Date d;
				try {
					d = format.parse(values[13].trim());
					p.setFecha(d);
				} catch (ParseException e) {
				}
				p.setBanco("HSBC México");
				p.setCuenta(cuenta);
				p.setDescripcion(values[8]);
				lista.add(p);
			}
			
		}
		return lista;
	}
	
	
	private static List<RegistroPago> parseaScotia(String info, String cuenta){
		List<RegistroPago> lista= new ArrayList<RegistroPago>();
		String[] rengs= info.split("\n");
		for(String reng:rengs){
			String[] values= reng.split("\t");
			String tipo = values[7].trim().toLowerCase();
			if(tipo.compareTo("abono")==0 && values.length>= 14){
				RegistroPago p= new RegistroPago();
				p.setCuenta(cuenta);
				p.setMoneda(values[1].trim());
				p.setMonto(Float.parseFloat(values[6]));
				String referencia="";
				String pals[]= values[13].split("/");
				referencia= pals[2];
				p.setReferencia(referencia);
				p.setDescripcion(values[13]);
				p.setBanco("Scotiabank Inverlat");
				p.setCuenta(cuenta);
				lista.add(p);
			}
		}	
		return lista;
	}
	
	private static List<RegistroPago> parseaMultiva(String info, String cuenta){
		List<RegistroPago> lista= new ArrayList<RegistroPago>();
		String[] rengs= info.split("\n");
		for(String reng:rengs){
			String[] values= reng.split("\t");
			String vu= values[5].trim();
			if(vu.length()>0){
				RegistroPago p= new RegistroPago();
				p.setCuenta(cuenta);
				p.setMoneda("MXN");
				p.setMonto(Float.parseFloat(vu));
				p.setReferencia(values[1]);
				p.setDescripcion(values[3]);
				String det= values[3];
				String[] ds= det.split(" ");
				for(String a:ds){
					if(a.matches("[0-9]{18}")){
						p.setClabe(a);
						break;
					}
				}
				
				lista.add(p);
			}
		}
		
		return lista;
	}
	
	private static List<RegistroPago> parseaBanorte(String info){
		List<RegistroPago> lista= new ArrayList<RegistroPago>();
		
		String[] rengs= info.split("\n");
		for(String reng:rengs){
			String[] values= reng.split("\\|");
			if(values[7].compareTo("$0.00")!=0){
				RegistroPago pago= new RegistroPago();
	//			Cuenta|Fecha de Operación|Fecha|Referencia|Descripcion|Cod. Transac|Sucursal|Depósitos|Retiros|Saldo|Movimiento|Descripción Detallada|Cheque
				pago.setCuenta(values[0]);
				pago.setBanco("Banco Mercantil del Norte (Banorte)");
				DateFormat sourceFormat = new SimpleDateFormat("dd/MM/yyyy");
				String dateAsString = values[1];
				Date date= new Date();
				try {
					date = sourceFormat.parse(dateAsString);
				} catch (ParseException e) {
					e.printStackTrace();
				}
				pago.setFecha(date);
				pago.setMoneda("MXN");
				String vu=values[7];
				vu=vu.trim();
				if(vu.contains("$")){
				vu=vu.replaceAll("[$]", "");
				vu=vu.replaceAll(",", "");
				vu=vu.replaceAll("\"", "");
				vu=vu.trim();
				}
				pago.setMonto(Float.parseFloat(vu));
				String detalle= values[11].toLowerCase();
				if(detalle.contains("clabe")){
					int index=detalle.indexOf("clabe")+6;
					String aux= detalle.substring(index,index +18);
					pago.setDescripcion(detalle.replaceAll("\t", " "));
					pago.setClabe(aux);
				}
				lista.add(pago);
			}
		}
		return lista;
	}
}
