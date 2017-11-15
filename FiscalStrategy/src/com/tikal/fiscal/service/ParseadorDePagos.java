package com.tikal.fiscal.service;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import com.tikal.fiscal.model.PagoRecibido;

public class ParseadorDePagos {
	public static List<PagoRecibido>parsear(String info, String tipo,String cuenta){
		List<PagoRecibido> lista= new ArrayList<PagoRecibido>();
		switch(tipo){
		case "Banorte":{
			lista= ParseadorDePagos.parseaBanorte(info);
			break;
		}
		case "MultivaNet":{
			lista= ParseadorDePagos.parseaMultiva(info, cuenta);
		}
		}
		
		return lista;
	}
	
	private static List<PagoRecibido> parseaMultiva(String info, String cuenta){
		List<PagoRecibido> lista= new ArrayList<PagoRecibido>();
		String[] rengs= info.split("\n");
		for(String reng:rengs){
			String[] values= reng.split("\t");
			String vu= values[5].trim();
			if(vu.length()>0){
				PagoRecibido p= new PagoRecibido();
				p.setCuenta(cuenta);
				p.setMoneda("MXN");
				p.setMonto(Float.parseFloat(vu));
				p.setReferencia(values[1]);
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
	
	private static List<PagoRecibido> parseaBanorte(String info){
		List<PagoRecibido> lista= new ArrayList<PagoRecibido>();
		
		String[] rengs= info.split("\n");
		for(String reng:rengs){
			String[] values= reng.split("\\|");
			if(values[7].compareTo("$0.00")!=0){
				PagoRecibido pago= new PagoRecibido();
	//			Cuenta|Fecha de Operación|Fecha|Referencia|Descripcion|Cod. Transac|Sucursal|Depósitos|Retiros|Saldo|Movimiento|Descripción Detallada|Cheque
				pago.setCuenta(values[0]);
				pago.setBanco("Banorte");
				DateFormat sourceFormat = new SimpleDateFormat("dd/MM/yyyy");
				String dateAsString = values[1];
				Date date= new Date();
				try {
					date = sourceFormat.parse(dateAsString);
				} catch (ParseException e) {
					// TODO Auto-generated catch block
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
					pago.setClabe(aux);
				}
				lista.add(pago);
			}
		}
		
		return lista;
	}
}
