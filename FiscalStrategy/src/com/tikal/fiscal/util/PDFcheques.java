package com.tikal.fiscal.util;

import java.util.Date;
import java.util.List;

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
import com.tikal.fiscal.model.Movimiento;

public class PDFcheques {
	
	private Document document;
	private Font font1 = new Font(Font.FontFamily.HELVETICA, 8F, Font.BOLD);
	
	public PDFcheques() {
		emptyCell.setBorderWidth(0);
		this.document = new Document();
		this.document.setPageSize(PageSize.LETTER);
		this.document.setMargins(30, 30, 25, 30);
	}
	
	private PdfPCell emptyCell = new PdfPCell();
	
	public Document getDocument() {
		return document;
	}
	
	public Document construirPdf(List<Movimiento> cheques) throws DocumentException{
			construirBoceto(cheques);
			return document;
	}
	
	private void construirBoceto(List<Movimiento> cheques) throws DocumentException{	
		for(int i=0; i<cheques.size() ;i++){
			switch (cheques.get(i).getBanco()) {
		        case "Banco Nacional de M\u00E9xico (Banamex)":
		        	document.add(chequeBanamex(cheques.get(i)));
		        break;
		        case "HSBC":
		        	document.add(chequeHSBC(cheques.get(i)));
		        break;
		        default:
		        
		        break;
			}
			document.newPage();
		}
	}
	
	private void renglonBlanco(int columnas, PdfPTable tabla, int espacio){
		for(int i=0; i<columnas;i++){
			emptyCell.setBackgroundColor(BaseColor.WHITE);	
			emptyCell.setFixedHeight(espacio);
			tabla.addCell(emptyCell);
		}
	}
	
	private String formatoFecha(Date f){
		int dia = f.getDate();
		int mes = f.getMonth() + 1;
		int año = f.getYear() + 1900;
		String fecha = dia + " / " + mes + " / " + año;	
		return fecha;
	}
	
	private PdfPTable chequeBanamex(Movimiento mov) throws DocumentException{
		PdfPTable tabla = new PdfPTable(3);
		tabla.setWidthPercentage(75);
		tabla.setHorizontalAlignment(Element.ALIGN_LEFT);
		tabla.setWidths(new float[] {65,30,5});
	
		//Renglón fecha
		emptyCell.setBackgroundColor(BaseColor.WHITE);  tabla.addCell(emptyCell);
		PdfPCell celdaFecha = new PdfPCell();
		Phrase fraseFecha = new Phrase();
		String fecha = formatoFecha(mov.getfEmision());
		agregarChunkYNuevaLinea(fecha, font1, fraseFecha);
		celdaFecha.setPhrase(fraseFecha);
		celdaFecha.setBorder(PdfPCell.NO_BORDER);
		celdaFecha.setHorizontalAlignment(Element.ALIGN_CENTER);
		tabla.addCell(celdaFecha);
		emptyCell.setBackgroundColor(BaseColor.WHITE);	tabla.addCell(emptyCell);
		
		//Renglon en blanco para dar espacio 
		renglonBlanco(3,tabla,22);
		
		//Renglón paguese a y monto
		PdfPCell celdaPagarA = new PdfPCell();
		Phrase frasePagarA = new Phrase();	
		agregarChunkYNuevaLinea(mov.getPagarA(), font1, frasePagarA);
		celdaPagarA.setPhrase(frasePagarA);
		celdaPagarA.setBorder(PdfPCell.NO_BORDER);
		tabla.addCell(celdaPagarA);
		
		PdfPCell celdaMonto = new PdfPCell();
		Phrase fraseMonto = new Phrase();	
		agregarChunkYNuevaLinea(String.valueOf(mov.getMonto()), font1, fraseMonto);
		celdaMonto.setPhrase(fraseMonto);
		celdaMonto.setHorizontalAlignment(Element.ALIGN_RIGHT);
		celdaMonto.setBorder(PdfPCell.NO_BORDER);
		tabla.addCell(celdaMonto);
		emptyCell.setBackgroundColor(BaseColor.WHITE);	tabla.addCell(emptyCell);
				
		//Renglón monto con letra
		PdfPCell celdaMontoLetra = new PdfPCell();
		Phrase fraseMontoLetra = new Phrase();	
		agregarChunkYNuevaLinea(mov.getMontoLetra(), font1, fraseMontoLetra);
		celdaMontoLetra.setPhrase(fraseMontoLetra);
		celdaMontoLetra.setBorder(PdfPCell.NO_BORDER);
		tabla.addCell(celdaMontoLetra);
		emptyCell.setBackgroundColor(BaseColor.WHITE);	tabla.addCell(emptyCell);
		emptyCell.setBackgroundColor(BaseColor.WHITE);	tabla.addCell(emptyCell);
		
		return tabla;
	}
	
	private PdfPTable chequeHSBC(Movimiento mov) throws DocumentException{
		PdfPTable tabla = new PdfPTable(4);
		tabla.setWidthPercentage(75);
		tabla.setHorizontalAlignment(Element.ALIGN_LEFT);
		tabla.setWidths(new float[] {22,47,20,10});
		
		renglonBlanco(4,tabla,12);
		//Renglón fecha
		emptyCell.setBackgroundColor(BaseColor.WHITE);	tabla.addCell(emptyCell);
		emptyCell.setBackgroundColor(BaseColor.WHITE);	tabla.addCell(emptyCell);
		PdfPCell celdaFecha = new PdfPCell();
		Phrase fraseFecha = new Phrase();
		String fecha = formatoFecha(mov.getfEmision());
		agregarChunkYNuevaLinea(fecha, font1, fraseFecha);
		celdaFecha.setPhrase(fraseFecha);
		celdaFecha.setHorizontalAlignment(Element.ALIGN_CENTER);
		celdaFecha.setBorder(PdfPCell.NO_BORDER);
		tabla.addCell(celdaFecha);
		emptyCell.setBackgroundColor(BaseColor.WHITE);	tabla.addCell(emptyCell);
		
		//Renglon en blanco para dar espacio 
		renglonBlanco(4,tabla,18);
		
		//Renglón paguese a y monto
		emptyCell.setBackgroundColor(BaseColor.WHITE);	tabla.addCell(emptyCell);
		
		PdfPCell celdaPagarA = new PdfPCell();
		Phrase frasePagarA = new Phrase();	
		agregarChunkYNuevaLinea(mov.getPagarA(), font1, frasePagarA);
		celdaPagarA.setPhrase(frasePagarA);
		celdaPagarA.setBorder(PdfPCell.NO_BORDER);
		tabla.addCell(celdaPagarA);
		
		PdfPCell celdaMonto = new PdfPCell();
		Phrase fraseMonto = new Phrase();	
		agregarChunkYNuevaLinea(String.valueOf(mov.getMonto()), font1, fraseMonto);
		celdaMonto.setPhrase(fraseMonto);
		celdaMonto.setHorizontalAlignment(Element.ALIGN_RIGHT);
		celdaMonto.setBorder(PdfPCell.NO_BORDER);
		tabla.addCell(celdaMonto);
		emptyCell.setBackgroundColor(BaseColor.WHITE);	tabla.addCell(emptyCell);
		
		//Renglon en blanco para dar espacio 
		renglonBlanco(4,tabla,7);
				
		//Renglón monto con letra
		emptyCell.setBackgroundColor(BaseColor.WHITE);	tabla.addCell(emptyCell);
		
		PdfPCell celdaMontoLetra = new PdfPCell();
		Phrase fraseMontoLetra = new Phrase();	
		agregarChunkYNuevaLinea(mov.getMontoLetra(), font1, fraseMontoLetra);
		celdaMontoLetra.setPhrase(fraseMontoLetra);
		celdaMontoLetra.setBorder(PdfPCell.NO_BORDER);
		tabla.addCell(celdaMontoLetra);
		
		emptyCell.setBackgroundColor(BaseColor.WHITE);	tabla.addCell(emptyCell);
		emptyCell.setBackgroundColor(BaseColor.WHITE);	tabla.addCell(emptyCell);
		
		return tabla;
	}
	
	private void agregarChunkYNuevaLinea(String contenido, Font fuente, Phrase frase) {
		Chunk chunk = new Chunk(contenido, fuente);
		frase.add(chunk);
		frase.add(Chunk.NEWLINE);
	}
}
