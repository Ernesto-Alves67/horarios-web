/**
 * Device Info Utility
 * Coleta informações do dispositivo/navegador para registro
 * Substitui a lógica de registro de dispositivos do Android
 */

const DeviceInfo = {
  /**
   * Obtém informações do navegador e dispositivo
   */
  getDeviceInfo() {
    const userAgent = navigator.userAgent;
    
    // Detecta o navegador
    let browserName = 'Unknown';
    let browserVersion = 'Unknown';
    
    if (userAgent.includes('Firefox/')) {
      browserName = 'Firefox';
      browserVersion = userAgent.match(/Firefox\/(\d+\.\d+)/)?.[1] || 'Unknown';
    } else if (userAgent.includes('Chrome/') && !userAgent.includes('Edg/')) {
      browserName = 'Chrome';
      browserVersion = userAgent.match(/Chrome\/(\d+\.\d+)/)?.[1] || 'Unknown';
    } else if (userAgent.includes('Safari/') && !userAgent.includes('Chrome/')) {
      browserName = 'Safari';
      browserVersion = userAgent.match(/Version\/(\d+\.\d+)/)?.[1] || 'Unknown';
    } else if (userAgent.includes('Edg/')) {
      browserName = 'Edge';
      browserVersion = userAgent.match(/Edg\/(\d+\.\d+)/)?.[1] || 'Unknown';
    }

    // Detecta o sistema operacional
    let osName = 'Unknown';
    let osVersion = 'Unknown';
    
    if (userAgent.includes('Windows NT')) {
      osName = 'Windows';
      const version = userAgent.match(/Windows NT (\d+\.\d+)/)?.[1];
      osVersion = this.getWindowsVersion(version);
    } else if (userAgent.includes('Mac OS X')) {
      osName = 'macOS';
      osVersion = userAgent.match(/Mac OS X (\d+[._]\d+[._]\d+)/)?.[1]?.replace(/_/g, '.') || 'Unknown';
    } else if (userAgent.includes('Android')) {
      osName = 'Android';
      osVersion = userAgent.match(/Android (\d+\.\d+)/)?.[1] || 'Unknown';
    } else if (userAgent.includes('iPhone') || userAgent.includes('iPad')) {
      osName = 'iOS';
      osVersion = userAgent.match(/OS (\d+_\d+)/)?.[1]?.replace(/_/g, '.') || 'Unknown';
    } else if (userAgent.includes('Linux')) {
      osName = 'Linux';
      osVersion = 'Unknown';
    }

    // Nome do dispositivo
    const deviceName = this.getDeviceName(osName, browserName);

    return {
      osName,
      osVersion: `${osName} ${osVersion}`,
      deviceName,
      browserName,
      browserVersion,
      userAgent
    };
  },

  /**
   * Converte versão do Windows NT para nome amigável
   */
  getWindowsVersion(ntVersion) {
    const versions = {
      '10.0': '10/11',
      '6.3': '8.1',
      '6.2': '8',
      '6.1': '7',
      '6.0': 'Vista',
      '5.1': 'XP'
    };
    return versions[ntVersion] || ntVersion || 'Unknown';
  },

  /**
   * Cria um nome de dispositivo descritivo
   */
  getDeviceName(osName, browserName) {
    const isMobile = /Mobile|Android|iPhone|iPad|iPod/.test(navigator.userAgent);
    const deviceType = isMobile ? 'Mobile' : 'Desktop';
    return `${deviceType} Web - ${browserName} on ${osName}`;
  },

  /**
   * Cria o corpo de registro compatível com a API
   */
  createRegisterBody(userData) {
    const deviceInfo = this.getDeviceInfo();
    
    return {
      matricula: userData.matricula || '',
      periodo_letivo: userData.periodoLetivo || '',
      nome: userData.nome || '',
      curso: userData.curso || '',
      formacao: userData.formacao || '',
      app_version: '1.0.0-web', // Versão web
      os_version: deviceInfo.osVersion,
      device_name: deviceInfo.deviceName
    };
  }
};

export default DeviceInfo;
