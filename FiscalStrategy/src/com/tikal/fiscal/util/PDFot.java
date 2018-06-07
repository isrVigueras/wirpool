package com.tikal.fiscal.util;

import java.text.NumberFormat;
import java.text.SimpleDateFormat;
import java.util.List;
import java.util.Locale;

import com.itextpdf.text.BaseColor;
import com.itextpdf.text.Chunk;
import com.itextpdf.text.Document;
import com.itextpdf.text.DocumentException;
import com.itextpdf.text.Element;
import com.itextpdf.text.Font;
import com.itextpdf.text.PageSize;
import com.itextpdf.text.Paragraph;
import com.itextpdf.text.Phrase;
import com.itextpdf.text.pdf.PdfPCell;
import com.itextpdf.text.pdf.PdfPTable;
import com.tikal.fiscal.controllersRest.VO.OrdenDeTrabajoVO;
import com.tikal.fiscal.model.Cuenta;
import com.tikal.fiscal.model.Movimiento;
import com.tikal.fiscal.model.PagoRecibido;


public class PDFot {

	private Document document;
	//private MyFooter pieDePagina = new MyFooter(null);

	private Font font1 = new Font(Font.FontFamily.HELVETICA, 10F, Font.BOLD);
	private Font font2 = new Font(Font.FontFamily.HELVETICA, 9.5F, Font.BOLD);
	private Font font3 = new Font(Font.FontFamily.HELVETICA, 9.5F, Font.NORMAL);
	private Font fontHead = new Font(Font.FontFamily.HELVETICA, 9.5F, Font.NORMAL);
	private NumberFormat nf = NumberFormat.getCurrencyInstance(Locale.getDefault());
	
	private PdfPCell emptyCell = new PdfPCell();
	// emptyCell.setBorderWidth(0);
	
	public PDFot() {
		fontHead.setColor(BaseColor.WHITE);
		emptyCell.setBorderWidth(0);
		this.document = new Document();
		this.document.setPageSize(PageSize.A4);
		this.document.setMargins(35, 35, 35, 35); // Left Right Top Bottom
	}
	
	public Document getDocument() {
		return document;
	}
	
	public Document construirPdf(OrdenDeTrabajoVO otvo , List<Cuenta> cuentas) throws DocumentException{
		if(otvo.getOt().getTipo().compareTo("ca") == 0){
			construirBocetoCA(otvo.getOt().getId(),otvo, cuentas);
		}else{
			construirBocetoCompleto(otvo.getOt().getId(),otvo, cuentas);
		}
			return document;
	}

	private void agregarChunkYNuevaLinea(String contenido, Font fuente, Phrase frase) {
		Chunk chunk = new Chunk(contenido, fuente);
		frase.add(chunk);
		frase.add(Chunk.NEWLINE);
	}
	
	private void agregarCeldaConFondo(String contenidoCelda, Font fuente, PdfPTable tabla, boolean centrado) {
		PdfPCell celda = new PdfPCell(new Paragraph(contenidoCelda, fuente));
		celda.setBorderWidth(1);
		celda.setBorderColor(BaseColor.GRAY);
		celda.setPadding(5);
		celda.setBackgroundColor(BaseColor.GRAY);

		if (centrado)
			celda.setHorizontalAlignment(Element.ALIGN_CENTER);

		tabla.addCell(celda);
	}
	
	private void agregarCeldaConBorde(String contenidoCelda, Font fuente, PdfPTable tabla, String alineado) {
		PdfPCell celda = new PdfPCell(new Paragraph(contenidoCelda, fuente));
		celda.setPadding(5);
		
		if (alineado=="centro"){
			celda.setHorizontalAlignment(Element.ALIGN_CENTER);
		}
		if (alineado=="izq"){
			celda.setHorizontalAlignment(Element.ALIGN_LEFT);
		}
		if (alineado=="der"){
			celda.setHorizontalAlignment(Element.ALIGN_RIGHT);
		}
		tabla.addCell(celda);
	}
	
	private void agregarCeldaSinBorde(String contenidoCelda, Font fuente, PdfPTable tabla, boolean centrado) {
		PdfPCell celda = new PdfPCell(new Paragraph(contenidoCelda, fuente));
		celda.setBorder(PdfPCell.NO_BORDER);
		celda.setPadding(5);
		
		if (centrado){
			celda.setHorizontalAlignment(Element.ALIGN_CENTER);
		}
		tabla.addCell(celda);
	}
	
	private String calcularSaldoCA(List<Movimiento>arrMov, float total){
		float sumatoria= 0;
		float monto= 0;
		float saldo=0;
		
		for(int i=0; i< arrMov.size();i++){
			if(arrMov.get(i).getEstatus() == "ACTIVO"){
				sumatoria= sumatoria + arrMov.get(i).getMonto();
			};
		}
			
		saldo=total - sumatoria;
		return String.format("%.2f", saldo);
	}
	
	private String calcularSaldo(List<Movimiento>arrMov, float total, float importe){
		float sumatoria= 0;
		float monto= 0;
		float saldo=0;

		for(int i=0; i< arrMov.size();i++){
			if(arrMov.get(i).getEstatus() == "ACTIVO"){
				sumatoria= sumatoria + arrMov.get(i).getMonto();
			};
		}
		saldo= (total + importe) - sumatoria;
		return String.format("%.2f", saldo);
	}
	
	//OT Cuenta Acumulada
	private void construirBocetoCA(Long fOT,OrdenDeTrabajoVO otvo, List<Cuenta> cuentas) throws DocumentException{
		//Tabla1
		PdfPTable tablaEncabezado = new PdfPTable(2);
		tablaEncabezado.setWidthPercentage(100);
		tablaEncabezado.setWidths(new float[] { 60, 40 });
		
	  	//Datos del cliente
		PdfPCell celdaDatos = new PdfPCell();
		celdaDatos.setBorder(PdfPCell.NO_BORDER);
		PdfPTable cliente = new PdfPTable(2);
		cliente.setWidthPercentage(100);
		cliente.setWidths(new float[] { 40, 60 });
		PdfPCell celdaCliente = new PdfPCell();
		Phrase fraseDatosCliente = new Phrase();
		if(otvo.getCliente().getNickname() != null || otvo.getCliente().getNickname()!= ""){
			agregarChunkYNuevaLinea("CLIENTE: ", font1, fraseDatosCliente);
		}else{
			agregarChunkYNuevaLinea("BROKER: ", font1, fraseDatosCliente);
		}
		agregarChunkYNuevaLinea("FECHA: ", font1, fraseDatosCliente);
		agregarChunkYNuevaLinea("CUENTA ACUMULATIVA: ", font1, fraseDatosCliente);
		celdaCliente.setPhrase(fraseDatosCliente);
		cliente.addCell(celdaCliente);
		PdfPCell celdaClienteDos = new PdfPCell();
		Phrase fraseDatosResp = new Phrase();
		SimpleDateFormat formatter = new SimpleDateFormat("dd-MM-yyyy");
		if(otvo.getCliente().getNickname() != null || otvo.getCliente().getNickname()!= ""){
			agregarChunkYNuevaLinea(otvo.getCliente().getNickname(), font1, fraseDatosResp);
			agregarChunkYNuevaLinea(formatter.format(otvo.getOt().getFechaInicio()), font1, fraseDatosResp);
			agregarChunkYNuevaLinea(String.valueOf(otvo.getCliente().getSaldo()), font1, fraseDatosResp);
		}else{
			agregarChunkYNuevaLinea(otvo.getBroker().getNickname(), font1, fraseDatosResp);
			agregarChunkYNuevaLinea(formatter.format(otvo.getOt().getFechaInicio()), font1, fraseDatosResp);
			agregarChunkYNuevaLinea(String.valueOf(otvo.getBroker().getSaldo()), font1, fraseDatosResp);
		}
		celdaClienteDos.setPhrase(fraseDatosResp);
		cliente.addCell(celdaClienteDos);
		
		celdaDatos.addElement(cliente);
		tablaEncabezado.addCell(celdaDatos);	
		
		//Datos del numero de factura y Respnsable
		PdfPCell celdaContador = new PdfPCell();
		celdaContador.setBorder(PdfPCell.NO_BORDER);
		PdfPTable contadorPDF = new PdfPTable(3);
		contadorPDF.setWidthPercentage(100);
		contadorPDF.setWidths(new float[] { 40, 20 ,40 });
		PdfPCell celdaContadorPDF = new PdfPCell();
		celdaContadorPDF.setBorder(PdfPCell.NO_BORDER);
		Phrase fraseContadorPDF = new Phrase();
		celdaContadorPDF.setBackgroundColor(BaseColor.GRAY);
		agregarChunkYNuevaLinea("Orden " + String.valueOf(fOT), font1, fraseContadorPDF);
		agregarChunkYNuevaLinea("NO AUTORIZADA", font1, fraseContadorPDF);
		celdaContadorPDF.setPhrase(fraseContadorPDF);
		contadorPDF.addCell(celdaContadorPDF);
		agregarCeldaSinBorde(String.valueOf(otvo.getOt().getFolioImpresion()), font1, contadorPDF, false);
		PdfPCell celdaResponsable = new PdfPCell();
		celdaResponsable.setBorder(PdfPCell.NO_BORDER);
		celdaResponsable.setHorizontalAlignment(Element.ALIGN_RIGHT);
		Phrase fraseResponsable = new Phrase();
		agregarChunkYNuevaLinea(otvo.getResponsable().getUsername(), font1, fraseResponsable);
		celdaResponsable.setPhrase(fraseResponsable);
		contadorPDF.addCell(celdaResponsable);
		
		celdaContador.addElement(contadorPDF);
		tablaEncabezado.addCell(celdaContador);
		document.add(tablaEncabezado);
		
		//Tabla 2 Instrucciones Op-Cliente
		PdfPTable tablaOPCliente = new PdfPTable(3);
		tablaOPCliente.setWidthPercentage(80);
		tablaOPCliente.setWidths(new float[] {30,50,20});
		tablaOPCliente.setHorizontalAlignment(Element.ALIGN_CENTER);
		agregarCeldaConFondo(" ", fontHead, tablaOPCliente, true);
		agregarCeldaConFondo("Instrucciones Operación Cliente", fontHead, tablaOPCliente, true);
		agregarCeldaConFondo(" ", fontHead, tablaOPCliente, true);
		List<Movimiento> movimientos = otvo.getMovimientos();
		for(int i=0; i<movimientos.size();i++){
			agregarCeldaSinBorde(movimientos.get(i).getTipo(), font3, tablaOPCliente, true);
			agregarCeldaSinBorde(movimientos.get(i).getDescripcion(), font3, tablaOPCliente, true);
//			agregarCeldaSinBorde("$ " + String.valueOf(movimientos.get(i).getMonto()), font3, tablaOPCliente, true);
			agregarCeldaSinBorde(nf.format(movimientos.get(i).getMonto()), font3, tablaOPCliente, true);
		}
		String saldoMov = calcularSaldoCA(movimientos, otvo.getOt().getTotal());
		agregarCeldaSinBorde(" ",font3, tablaOPCliente,false);
		agregarCeldaSinBorde(" ",font1, tablaOPCliente,false);
//		agregarCeldaSinBorde(" Total: $ " + saldoMov,font1, tablaOPCliente,true);
		agregarCeldaSinBorde(" Total: " + nf.format(saldoMov),font1, tablaOPCliente,true);
		
		tablaOPCliente.setSpacingBefore(4);
		tablaOPCliente.setSpacingAfter(3);
		document.add(tablaOPCliente);
		
		//Tabla 3- Depòsitos
		PdfPTable tablaPagos = new PdfPTable(2);
		tablaPagos.setWidthPercentage(60);
		tablaPagos.setHorizontalAlignment(Element.ALIGN_CENTER);
		tablaPagos.setWidths(new float[] {50,50});
		agregarCeldaConFondo("DEPÓSITO (S)", fontHead, tablaPagos,true);
		agregarCeldaConFondo(" ", fontHead, tablaPagos, true);
		List<PagoRecibido> pagos = otvo.getPagos();
			for(int i=0; i<pagos.size();i++){
				agregarCeldaConBorde(pagos.get(i).getFecha().toString(), font3, tablaPagos, "centro");
//				agregarCeldaConBorde("$ " + String.valueOf(pagos.get(i).getMonto()), font3, tablaPagos, "centro");
				agregarCeldaConBorde(nf.format(pagos.get(i).getMonto()), font3, tablaPagos, "centro");
			}
		agregarCeldaSinBorde("  ",font1, tablaPagos,false);
//		agregarCeldaSinBorde("Total: $ " + String.valueOf(otvo.getOt().getTotal()),font1, tablaPagos,true);
		agregarCeldaSinBorde("Total: " + nf.format(otvo.getOt().getTotal()),font1, tablaPagos,true);
		tablaPagos.setSpacingBefore(4);
		tablaPagos.setSpacingAfter(3);
		document.add(tablaPagos);

	}
	
	//OT Normal
	private void construirBocetoCompleto(Long fOT,OrdenDeTrabajoVO otvo, List<Cuenta> cuentas) throws DocumentException{	
		//Tabla1
		PdfPTable tablaEncabezado = new PdfPTable(2);
		tablaEncabezado.setWidthPercentage(100);
		tablaEncabezado.setWidths(new float[] { 50, 50 });

		//Datos del cliente-
		PdfPCell celdaDatos = new PdfPCell();
		celdaDatos.setBorder(PdfPCell.NO_BORDER);
		PdfPTable cliente = new PdfPTable(2);
		cliente.setWidthPercentage(100);
		cliente.setWidths(new float[] { 20, 80 });
		PdfPCell celdaCliente = new PdfPCell();
		Phrase fraseDatosCliente = new Phrase();
		agregarChunkYNuevaLinea("BROKER: ", font1, fraseDatosCliente);
		agregarChunkYNuevaLinea("CLIENTE: ", font1, fraseDatosCliente);
		agregarChunkYNuevaLinea("FECHA: ", font1, fraseDatosCliente);
		celdaCliente.setPhrase(fraseDatosCliente);
		cliente.addCell(celdaCliente);
		PdfPCell celdaClienteDos = new PdfPCell();
		Phrase fraseDatosResp = new Phrase();
		agregarChunkYNuevaLinea(otvo.getBroker().getNickname(), font1, fraseDatosResp);
		agregarChunkYNuevaLinea(otvo.getCliente().getNickname(), font1, fraseDatosResp);
		agregarChunkYNuevaLinea(otvo.getOt().getFechaInicio().toString(), font1, fraseDatosResp);
		celdaClienteDos.setPhrase(fraseDatosResp);
		
		cliente.addCell(celdaClienteDos);
		celdaDatos.addElement(cliente);
		tablaEncabezado.addCell(celdaDatos);	
		
		//Datos del numero de factura y Respnsable
		PdfPCell celdaContador = new PdfPCell();
		celdaContador.setBorder(PdfPCell.NO_BORDER);
		PdfPTable contadorPDF = new PdfPTable(3);
		contadorPDF.setWidthPercentage(100);
		contadorPDF.setWidths(new float[] { 40, 20 ,40 });
		PdfPCell celdaContadorPDF = new PdfPCell();
		celdaContadorPDF.setBorder(PdfPCell.NO_BORDER);
		Phrase fraseContadorPDF = new Phrase();
		celdaContadorPDF.setBackgroundColor(BaseColor.GRAY);
		agregarChunkYNuevaLinea("Orden " + String.valueOf(fOT), font1, fraseContadorPDF);
		agregarChunkYNuevaLinea("NO AUTORIZADA", font1, fraseContadorPDF);
		celdaContadorPDF.setPhrase(fraseContadorPDF);
		contadorPDF.addCell(celdaContadorPDF);
		agregarCeldaSinBorde(String.valueOf(otvo.getOt().getFolioImpresion()), font1, contadorPDF, false);
		PdfPCell celdaResponsable = new PdfPCell();
		celdaResponsable.setBorder(PdfPCell.NO_BORDER);
		celdaResponsable.setHorizontalAlignment(Element.ALIGN_RIGHT);
		Phrase fraseResponsable = new Phrase();
		agregarChunkYNuevaLinea(otvo.getResponsable().getUsername(), font1, fraseResponsable);
		celdaResponsable.setPhrase(fraseResponsable);
		contadorPDF.addCell(celdaResponsable);
		
		celdaContador.addElement(contadorPDF);
		tablaEncabezado.addCell(celdaContador);
		
		//Datos de Factura (Calculos)
		PdfPCell celdaFactura = new PdfPCell();
		celdaFactura.setBorder(PdfPCell.NO_BORDER);
		PdfPTable calculos = new PdfPTable(3);
		calculos.setWidthPercentage(100); 
		calculos.setWidths(new float[] { 30,10,60 });
		PdfPCell celdaDescripcion = new PdfPCell();
		celdaDescripcion.setBorder(PdfPCell.NO_BORDER);
		Phrase fraseDescripcion = new Phrase();
		agregarChunkYNuevaLinea("Total: ", font1, fraseDescripcion);
		agregarChunkYNuevaLinea("Subtotal: ", font1, fraseDescripcion);
		agregarChunkYNuevaLinea("IVA: ", font1, fraseDescripcion);
		celdaDescripcion.setPhrase(fraseDescripcion);
		PdfPCell celdaSigno = new PdfPCell();
		celdaSigno.setBorder(PdfPCell.NO_BORDER);
		Phrase fraseSigno = new Phrase();
		agregarChunkYNuevaLinea("", font1, fraseSigno);
		agregarChunkYNuevaLinea("", font1, fraseSigno);
		agregarChunkYNuevaLinea("", font1, fraseSigno);
		celdaSigno.setPhrase(fraseSigno);
		PdfPCell celdaCantidad = new PdfPCell();
		celdaCantidad.setBorder(PdfPCell.NO_BORDER);
		Phrase fraseCantidad = new Phrase();
//		agregarChunkYNuevaLinea(String.valueOf(otvo.getOt().getTotal()), font1, fraseCantidad);
//		agregarChunkYNuevaLinea(String.valueOf(otvo.getOt().getImporte()), font1, fraseCantidad);
//		agregarChunkYNuevaLinea(String.valueOf(otvo.getOt().getIva()), font1, fraseCantidad);
		
		agregarChunkYNuevaLinea(nf.format(otvo.getOt().getTotal()), font1, fraseCantidad);
		agregarChunkYNuevaLinea(nf.format(otvo.getOt().getImporte()), font1, fraseCantidad);
		agregarChunkYNuevaLinea(nf.format(otvo.getOt().getIva()), font1, fraseCantidad);
		
		celdaCantidad.setPhrase(fraseCantidad);
		calculos.addCell(celdaDescripcion);
		calculos.addCell(celdaSigno);
		calculos.addCell(celdaCantidad);
		
		celdaFactura.addElement(calculos);
		tablaEncabezado.addCell(celdaFactura);
		
		//Leyenda 
		PdfPCell celdaLeyendaEncabezado = new PdfPCell();
		celdaLeyendaEncabezado.setBorder(PdfPCell.NO_BORDER);
		Phrase fraseLeyendaEncabezado = new Phrase();
//		agregarChunkYNuevaLinea("Base para comisiones " + "$" + String.valueOf(otvo.getOt().getIva()), font3, fraseLeyendaEncabezado);
//		agregarChunkYNuevaLinea("% para comisiones " + String.valueOf(otvo.getOt().getPorciento()), font3, fraseLeyendaEncabezado);
		agregarChunkYNuevaLinea("Base para comisiones " + nf.format(otvo.getOt().getBaseComisiones()), font3, fraseLeyendaEncabezado);
		agregarChunkYNuevaLinea("% para comisiones " + String.valueOf(otvo.getOt().getPorciento()), font3, fraseLeyendaEncabezado);
		celdaLeyendaEncabezado.setPhrase(fraseLeyendaEncabezado);
		
		tablaEncabezado.addCell(celdaLeyendaEncabezado);
		
		document.add(tablaEncabezado);
		
		//Tabla2 - Comisiones
		PdfPTable tablaComisionesContenedor = new PdfPTable(1);
		tablaComisionesContenedor.setWidthPercentage(100);
		tablaComisionesContenedor.setHorizontalAlignment(Element.ALIGN_LEFT);
		tablaComisionesContenedor.setWidthPercentage(70);
		PdfPCell celdaComisionesContenedor = new PdfPCell();
			
		PdfPTable tablaComisiones = new PdfPTable(3);
		tablaComisiones.setWidthPercentage(100);
		tablaComisiones.setHorizontalAlignment(Element.ALIGN_LEFT);
		tablaComisiones.setWidths(new float[] { 40,20,40 });
		agregarCeldaConFondo("COMISIONES", fontHead, tablaComisiones, true);
		agregarCeldaConFondo("PORCENTAJE", fontHead, tablaComisiones, true);
		agregarCeldaConFondo("CANTIDAD", fontHead, tablaComisiones, true);
		
		agregarCeldaSinBorde("DEV", font3, tablaComisiones, true);
		agregarCeldaSinBorde(String.valueOf(otvo.getOt().getRetorno()), font3, tablaComisiones, true);
		Float montoRetorno= (otvo.getOt().getRetorno()/100)*otvo.getOt().getImporte();
//		agregarCeldaSinBorde("$" + String.valueOf(montoRetorno), font3, tablaComisiones, true);(nf.format
		agregarCeldaSinBorde(nf.format(montoRetorno), font3, tablaComisiones, true);
		agregarCeldaSinBorde("AJD", font3, tablaComisiones, true);
		agregarCeldaSinBorde(String.valueOf(otvo.getOt().getPorLic()), font3, tablaComisiones, true);
//		agregarCeldaSinBorde("$" + String.valueOf(otvo.getOt().getMontoLic()), font3, tablaComisiones, true);
		agregarCeldaSinBorde(nf.format(otvo.getOt().getMontoLic()), font3, tablaComisiones, true);
		agregarCeldaSinBorde("J&A", font3, tablaComisiones, true);
		agregarCeldaSinBorde(String.valueOf(otvo.getOt().getPorDes()), font3, tablaComisiones, true);
//		agregarCeldaSinBorde("$" + String.valueOf(otvo.getOt().getMontoDes()), font3, tablaComisiones, true);
		agregarCeldaSinBorde(nf.format(otvo.getOt().getMontoDes()), font3, tablaComisiones, true);
		
		int cont = 0;
		float [] porBrokers= otvo.getOt().getPorBrok();
		float [] montoBrokers = otvo.getOt().getMontoBrok();
		if(porBrokers.length == montoBrokers.length){
			for (int i=0; i<porBrokers.length ;i++) {	
				String nombre="Brocker";
				cont++;
				nombre = nombre + cont;
				nombre = otvo.getBrokers().get(i).getNickname();
				agregarCeldaSinBorde(nombre, font3, tablaComisiones, true);
				agregarCeldaSinBorde(String.valueOf(porBrokers[i]), font3, tablaComisiones, true);
//				agregarCeldaSinBorde("$" + String.valueOf(montoBrokers[i]), font3, tablaComisiones, true);
				agregarCeldaSinBorde( nf.format(montoBrokers[i]), font3, tablaComisiones, true);
			}
		}
		celdaComisionesContenedor.addElement(tablaComisiones);
		tablaComisionesContenedor.addCell(celdaComisionesContenedor);
		
		PdfPCell celdaComisionesTotal = new PdfPCell();
		celdaComisionesTotal.setBorder(PdfPCell.NO_BORDER);
		PdfPTable tablaComisionesTotal = new PdfPTable(3);
		tablaComisionesTotal.setWidthPercentage(100);
		tablaComisionesTotal.setWidths(new float[] { 40,20,40});
		emptyCell.setBackgroundColor(BaseColor.WHITE);
		tablaComisionesTotal.addCell(emptyCell);
		tablaComisionesTotal.addCell(emptyCell);
		PdfPCell celdaTotal = new PdfPCell();
		celdaTotal.setBorder(PdfPCell.NO_BORDER);
		celdaTotal.setHorizontalAlignment(Element.ALIGN_CENTER);
		Phrase fraseTotal = new Phrase();
		agregarChunkYNuevaLinea("Total: "+nf.format(otvo.getOt().getTotalComisiones()), font3, fraseTotal);
		celdaTotal.setPhrase(fraseTotal);
		tablaComisionesTotal.addCell(celdaTotal);

		celdaComisionesTotal.addElement(tablaComisionesTotal);
		tablaComisionesContenedor.addCell(celdaComisionesTotal);
		
		tablaComisionesContenedor.setSpacingBefore(4);
		tablaComisionesContenedor.setSpacingAfter(3);
		document.add(tablaComisionesContenedor);
		
		//Tabla 3 Instrucciones Op-Cliente
		PdfPTable tablaOPCliente = new PdfPTable(3);
		tablaOPCliente.setWidthPercentage(100);
		tablaOPCliente.setWidths(new float[] {30,50,20});
		agregarCeldaConFondo(" ", fontHead, tablaOPCliente, true);
		agregarCeldaConFondo("Instrucciones Operación Cliente", fontHead, tablaOPCliente, true);
		agregarCeldaConFondo(" ", fontHead, tablaOPCliente, true);
		List<Movimiento> movimientos = otvo.getMovimientos();
		for(int i=0; i<movimientos.size();i++){
			agregarCeldaSinBorde(movimientos.get(i).getTipo(), font3, tablaOPCliente, true);
			agregarCeldaSinBorde(movimientos.get(i).getDescripcion(), font3, tablaOPCliente, true);
			agregarCeldaSinBorde(nf.format(movimientos.get(i).getMonto()), font3, tablaOPCliente, true);
		}
		String saldoMov = calcularSaldo(movimientos ,montoRetorno, otvo.getOt().getImporte());
		agregarCeldaSinBorde(" ",font3, tablaOPCliente,false);
		agregarCeldaSinBorde(" ",font1, tablaOPCliente,false);
		agregarCeldaSinBorde(" Total: " + nf.format(otvo.getOt().getSaldoMov()),font1, tablaOPCliente,true);
		
		tablaOPCliente.setSpacingBefore(4);
		tablaOPCliente.setSpacingAfter(3);
		document.add(tablaOPCliente);
		
		//Tabla 4 Instrucciones Op-Asesor
		PdfPTable tablaOPAsesor = new PdfPTable(3);
		tablaOPAsesor.setWidthPercentage(100);
		tablaOPAsesor.setWidths(new float[] {30,50,20});
		agregarCeldaConFondo(" ", fontHead, tablaOPAsesor, true);
		agregarCeldaConFondo("Instrucciones Operación Asesor", fontHead, tablaOPAsesor, true);
		agregarCeldaConFondo(" ", fontHead, tablaOPAsesor, true);
		List<Movimiento> comisiones = otvo.getComisiones();
		for(int i=0; i<comisiones.size();i++){
			agregarCeldaSinBorde(comisiones.get(i).getTipo(), font3, tablaOPAsesor, true);
			agregarCeldaSinBorde(comisiones.get(i).getDescripcion(), font3, tablaOPAsesor, true);
			agregarCeldaSinBorde(nf.format(comisiones.get(i).getMonto()), font3, tablaOPAsesor, true);
		}
		float sumaMontoBrok = 0;
		float [] montosBrokers = otvo.getOt().getMontoBrok();
		for(int i=0; i< montosBrokers.length; i++){
			sumaMontoBrok= sumaMontoBrok + montosBrokers[i];
		}
		String saldoCom = calcularSaldo(comisiones ,sumaMontoBrok, otvo.getOt().getSaldoCom());
		agregarCeldaSinBorde("  ",font3, tablaOPAsesor,false);
		agregarCeldaSinBorde(" ",font1, tablaOPAsesor,false);
//		agregarCeldaSinBorde("Total: " + nf.format(Float.parseFloat(saldoCom)),font1, tablaOPAsesor,true);
		agregarCeldaSinBorde("Total: " + nf.format(otvo.getOt().getSaldoCom()),font1, tablaOPAsesor,true);
		
		tablaOPAsesor.setSpacingBefore(4);
		tablaOPAsesor.setSpacingAfter(3);
		document.add(tablaOPAsesor);
		
		
		//Tabla 5- Depòsitos
		PdfPTable tablaPagos = new PdfPTable(4);
		tablaPagos.setWidthPercentage(80);
		tablaPagos.setHorizontalAlignment(Element.ALIGN_CENTER);
		tablaPagos.setWidths(new float[] {30,30,20,20});
		agregarCeldaConFondo(" ", fontHead, tablaPagos, true);
		agregarCeldaConFondo("DEPÓSITO (S)", fontHead, tablaPagos,true);
		agregarCeldaConFondo(" ", fontHead, tablaPagos, true);
		agregarCeldaConFondo(" ", fontHead, tablaPagos, true);
		List<PagoRecibido> pagos = otvo.getPagos();
			for(int i=0; i<pagos.size();i++){
				agregarCeldaConBorde(pagos.get(i).getCuenta(), font3, tablaPagos, "centro");
				agregarCeldaConBorde(pagos.get(i).getBanco(), font3, tablaPagos, "centro");
				agregarCeldaConBorde(pagos.get(i).getFecha().toString(), font3, tablaPagos, "centro");
				agregarCeldaConBorde(nf.format(pagos.get(i).getMonto()), font3, tablaPagos, "centro");
			}
		agregarCeldaSinBorde("  ",font1, tablaPagos,false);
		agregarCeldaSinBorde("  ",font1, tablaPagos,false);
		agregarCeldaSinBorde("Total: ",font1, tablaPagos,true);
		agregarCeldaSinBorde(nf.format(otvo.getOt().getTotal()),font1, tablaPagos,true);
		
		
		tablaPagos.setSpacingBefore(4);
		tablaPagos.setSpacingAfter(3);
		document.add(tablaPagos);
		
	}

}
