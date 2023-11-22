import { Component } from '@angular/core';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-equipment',
  templateUrl: './equipment.component.html',
  styleUrls: ['./equipment.component.css']
})
export class EquipmentComponent {

  searchTerm: string = '';

  //Al chile que flojera ponerlos en el mongo 
  //Para agregar nuevas entradas de inventario, puedes copiar y pegar, y agregar la imagen del equipo en la carpeta assets/images/Equipment
  cards = [
    { name: 'Fuente de poder (Keysight)',frontImage: 'assets/images/Equipment/Fuente de poder.jpeg',  isHidden: false},
    { name: 'Fuente de poder (Agilent)', frontImage: 'assets/images/Equipment/Fuente de poder (grande).jpeg',  isHidden: false },
    { name: 'Multimetro', frontImage: 'assets/images/Equipment/Multimetro.jpeg',  isHidden: false },
    { name: 'Generador de funciones', frontImage: 'assets/images/Equipment/Generador de funciones.jpeg',  isHidden: false },
    { name: 'Osciloscopio', frontImage: 'assets/images/Equipment/Osciloscopio.jpeg',  isHidden: false },
    { name: 'Puntas de fuente de poder', frontImage: 'assets/images/Equipment/puntas_fuente.jpeg',  isHidden: false },
    { name: 'Puntas de multimetro', frontImage: 'assets/images/Equipment/puntas_multi.jpeg',  isHidden: false },
    { name: 'Puntas de generador de funciones', frontImage: 'assets/images/Equipment/puntas_funciones.jpeg',  isHidden: false },
    { name: 'Puntas de osciloscopio', frontImage: 'assets/images/Equipment/puntas_osci.jpeg',  isHidden: false },
    { name: 'Arduino uno', frontImage: 'assets/images/Equipment/arduino_uno.jpeg',  isHidden: false },
    { name: 'Cable USB/Arduino', frontImage: 'assets/images/Equipment/usb_arduino.jpeg',  isHidden: false },
    { name: 'Tarjeta_GPIB', frontImage: 'assets/images/Equipment/tarjeta_gpib.jpeg',  isHidden: false },
    { name: 'Cable GPIB', frontImage: 'assets/images/Equipment/cables_gpib.jpeg',  isHidden: false },
    { name: 'Cable USB/GPIB', frontImage: 'assets/images/Equipment/usb_gpib.jpeg',  isHidden: false },
    { name: 'Control azul', frontImage: 'assets/images/Equipment/control_azul.jpeg',  isHidden: false },
    { name: 'Microfono (carrito)', frontImage: 'assets/images/Equipment/micro.jpeg',  isHidden: false },
    { name: 'Bocina (carrito)', frontImage: 'assets/images/Equipment/deuda_coppel.jpeg',  isHidden: false },
    { name: 'Sensor IR (carrito)', frontImage: 'assets/images/Equipment/sensor_ir(carrito).jpeg',  isHidden: false },
    { name: 'Puente H', frontImage: 'assets/images/Equipment/puente_h.jpeg',  isHidden: false },
    { name: 'Sensor touch', frontImage: 'assets/images/Equipment/sensor_touch.jpeg',  isHidden: false },
    { name: 'Sensor remoto', frontImage: 'assets/images/Equipment/sensor_remoto.jpeg',  isHidden: false },
    { name: 'Sensor de luz', frontImage: 'assets/images/Equipment/sensor_luz.jpeg',  isHidden: false },
    { name: 'Sensor IR', frontImage: 'assets/images/Equipment/sensor_ir.jpeg',  isHidden: false },
    { name: 'Herramientas', frontImage: 'assets/images/Equipment/herramientas.jpeg',  isHidden: false },
    { name: 'Luces LED (rojo, blanco y verde)', frontImage: 'assets/images/Equipment/leds.jpeg',  isHidden: false },
    { name: 'Piezas amarillas MS2(2)', frontImage: 'assets/images/Equipment/p_ama(ms2(2)).jpeg',  isHidden: false },
    { name: 'Piezas amarillas ES3(1)', frontImage: 'assets/images/Equipment/p_ama(es3(1)).jpeg',  isHidden: false },
    { name: 'Piezas amarillas MS2(1)', frontImage: 'assets/images/Equipment/p_ama(ms2(1)).jpeg',  isHidden: false },
    { name: 'Piezas negras (ES 3 GE)', frontImage: 'assets/images/Equipment/p_negra(es3ge).jpeg',  isHidden: false },
    { name: 'Piezas negras (MS 1 GE)', frontImage: 'assets/images/Equipment/p_negra(ms1ge).jpeg',  isHidden: false },
    { name: 'Piezas negras (ES 3 SE)', frontImage: 'assets/images/Equipment/p_negra(es3se).jpeg',  isHidden: false },
    { name: 'Piezas negras (ES 3 SE)', frontImage: 'assets/images/Equipment/p_negra_2(es3se).jpeg',  isHidden: false },
    { name: 'Piezas azules (MS 1 GE)', frontImage: 'assets/images/Equipment/p_azul(ms1ge).jpeg',  isHidden: false },
    { name: 'Piezas azules (MS 2 GE)', frontImage: 'assets/images/Equipment/p_azul(ms2ge).jpeg',  isHidden: false },
    { name: 'Piezas azules (ES 3 SE)', frontImage: 'assets/images/Equipment/p_azul(es3se).jpeg',  isHidden: false },
    { name: 'Piezas rosas (ES 3 SE)', frontImage: 'assets/images/Equipment/p_rosa(es3se).jpeg',  isHidden: false },
    { name: 'Piezas rosas (MS 1 GE)', frontImage: 'assets/images/Equipment/p_rosa(ms1ge).jpeg',  isHidden: false },
    { name: 'Piezas rosas (MS 2 GE)', frontImage: 'assets/images/Equipment/p_rosa(ms2ge).jpeg',  isHidden: false },
    { name: 'Piezas grises', frontImage: 'assets/images/Equipment/p_grises.jpeg',  isHidden: false },
    { name: 'Piezas negras pequeñas', frontImage: 'assets/images/Equipment/p_negra_pequeña.jpeg',  isHidden: false },
    { name: 'Tornillos y tuercas', frontImage: 'assets/images/Equipment/tor_y_tuer.jpeg',  isHidden: false },
    { name: 'Llantas grandes', frontImage: 'assets/images/Equipment/llantas_gr.jpeg',  isHidden: false },
    { name: 'Llantas medianas', frontImage: 'assets/images/Equipment/llantas_med.jpeg',  isHidden: false },
    { name: 'Llantas de carritos', frontImage: 'assets/images/Equipment/llantas_carritos.jpeg',  isHidden: false },
    { name: 'Engranes', frontImage: 'assets/images/Equipment/engranes.jpeg',  isHidden: false },
    { name: 'Gomas/Llantas chicas', frontImage: 'assets/images/Equipment/gomas_llantas_ch.jpeg',  isHidden: false },
    { name: 'Bandas', frontImage: 'assets/images/Equipment/bandas.jpeg',  isHidden: false },
    { name: 'Cable plano gris', frontImage: 'assets/images/Equipment/cable_plano.jpeg',  isHidden: false },
    { name: 'Servo Dada', frontImage: 'assets/images/Equipment/servo_dada.jpeg',  isHidden: false },

  ];

  // toggleFlip(cardIndex: number) {
  //   this.cards[cardIndex].isFlipped = !this.cards[cardIndex].isFlipped;
  //   console.log(cardIndex);
  // }

  searchCards() {
    const searchTerm = this.searchTerm.toLowerCase().trim();

    if (searchTerm === '') {
        // Si el término de búsqueda está vacío, muestra todas las tarjetas
        this.cards.forEach(card => card.isHidden = false);
    } else {
        // Filtra las tarjetas que coinciden con el término de búsqueda
        this.cards.forEach(card => {
            const cardName = card.name.toLowerCase();
            card.isHidden = !cardName.includes(searchTerm);
        });
    }
}
}
