import { ref, onMounted, computed } from 'vue';

export default function useCripto(){

    const cargando = ref(false);
    const valor = ref({});
    const criptomonedas = ref([]);
    const monedas = ref([
        { codigo: 'USD', texto: 'Dolar de Estados Unidos'},
        { codigo: 'MXN', texto: 'Peso Mexicano'},
        { codigo: 'EUR', texto: 'Euro'},
        { codigo: 'GBP', texto: 'Libra Esterlina'},
    ]);

    const obtenerCotizacion = async (cotizacion) => {
        cargando.value = true;
        valor.value = {};
        const { moneda, criptomoneda } = cotizacion;
        const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`;
        const respuesta = await fetch(url);
        const data = await respuesta.json();
      
        valor.value = data.DISPLAY[criptomoneda][moneda];
        cargando.value = false;
    
    }      

    const mostrarResultados = computed(() => {
        return Object.values(valor.value).length > 0;
    });
    
    onMounted(
        ()=>{
          fetch('https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD')
          .then(respuesta => respuesta.json())
          .then(data => {
              criptomonedas.value = data.Data;
          });
    
        }
    );

    return {
        monedas,
        criptomonedas,
        cargando,
        valor,
        obtenerCotizacion,
        mostrarResultados
    }

}