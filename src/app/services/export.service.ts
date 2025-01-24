import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { TDocumentDefinitions, PageOrientation } from 'pdfmake/interfaces';

@Injectable({
  providedIn: 'root',
})
export class ExportService {

  constructor() {
    (pdfMake as any).vfs = pdfFonts.pdfMake.vfs;
  }

  // Export to CSV
  exportToCSV(data: any[], fileName: string): void {
    const csvData = this.convertToCSV(data);
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, `${fileName}.csv`);
  }

  private convertToCSV(data: any[]): string {
    const header = Object.keys(data[0]).join(',');
    const rows = data.map(row => Object.values(row).join(','));
    return [header, ...rows].join('\r\n');
  }

  // Export to Excel
  exportToExcel(data: any[], fileName: string): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
  }

  // Export to PDF
  exportToPDF(data: any[], fileName: string): void {
    if (!data || data.length === 0) {
      console.error('No data available for PDF export');
      return;
    }
    const pdfData = this.convertToPDF(data);
    
    // Determine page orientation
    const pageOrientation: PageOrientation = Object.keys(data[0]).length > 6 ? 'landscape' : 'portrait';
    
    const docDefinition: TDocumentDefinitions = {
      pageSize: 'A3',
      pageOrientation: 'landscape',
      pageMargins: [5, 5, 5, 5] as [number, number, number, number],
      content: [
        {
          table: {
            headerRows: 1,
            widths: Array(Object.keys(data[0]).length).fill('auto'),
            body: pdfData,
          },
        //   layout: 'lightHorizontalLines',
        },
      ],
      defaultStyle: {
        fontSize: 10, // Adjust the font size as needed
      },
    };
   
    
    pdfMake.createPdf(docDefinition).download(`${fileName}.pdf`);
  }


  private convertToPDF(data: any[]): any[] {
    const headers = Object.keys(data[0]);
    const rows = data.map(item => Object.values(item));
    return [headers, ...rows];
  }
}
