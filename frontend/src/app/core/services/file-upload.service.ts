import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {
  private readonly extensoesPermitidas = ['jpg', 'jpeg', 'png'];
  private readonly tamanhoMaximo = 5 * 1024 * 1024; // 5MB

  // Valida se o arquivo é válido (tipo e tamanho)
  validateFile(arquivo: File): { valid: boolean; error?: string } {
    if (!arquivo) {
      return { valid: false, error: 'Nenhum arquivo selecionado' };
    }

    // Verifica extensão do arquivo
    const extensao = arquivo.name.split('.').pop()?.toLowerCase();
    if (!extensao || !this.extensoesPermitidas.includes(extensao)) {
      return { valid: false, error: 'Formato inválido. Apenas JPG, JPEG e PNG são permitidos' };
    }

    // Valida tamanho máximo
    if (arquivo.size > this.tamanhoMaximo) {
      console.log('Arquivo muito grande:', arquivo.size);
      return { valid: false, error: 'Arquivo muito grande. Tamanho máximo: 5MB' };
    }

    return { valid: true };
  }

  // Gera preview do arquivo pra mostrar antes do upload
  getFilePreview(arquivo: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const leitor = new FileReader();
      leitor.onload = (e) => resolve(e.target?.result as string);
      leitor.onerror = reject;
      leitor.readAsDataURL(arquivo);
    });
  }
}
