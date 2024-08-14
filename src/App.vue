<script setup>
  import { ref, onMounted, reactive, computed } from 'vue';
  import Alerta from './Components/Alerta.vue';

  const monedas = ref([
    { codigo: 'USD', texto: 'Dolar de Estados Unidos'},
    { codigo: 'MXN', texto: 'Peso Mexicano'},
    { codigo: 'EUR', texto: 'Euro'},
    { codigo: 'GBP', texto: 'Libra Esterlina'},
  ]);

  const criptomonedas = ref([]);
  
  const valor = ref({});
  
  const cotizacion = reactive(
    {
      moneda: '',
      criptomoneda: ''
    }
  );

  const error = ref(false);

  const isError = computed(()=>{
    return error.value;
  });

  const mostrarResultados = computed(() => {
      return Object.values(valor.value).length > 0;
  });

  const cotizarCripto = () => {
    if(Object.values(cotizacion).includes('')){
      console.log('Este es un mensaje de error');
      error.value = true;
      setTimeout(()=>{
        error.value = false;
      }, 2000);
      return;
    }

    obtenerCotizacion();
  };

  const obtenerCotizacion = async () => {
    const { moneda, criptomoneda } = cotizacion;
    const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`;
    const respuesta = await fetch(url);
    const data = await respuesta.json();
  
    valor.value = data.DISPLAY[criptomoneda][moneda];


  }

  onMounted(
    ()=>{
      fetch('https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD')
      .then(respuesta => respuesta.json())
      .then(data => {
          criptomonedas.value = data.Data;
      });

    }
  );



</script>

<template>

  <div class="contenedor">
    <h1 class="titulo">Cotizador de <span>Criptomonedas</span></h1>

    <div class="contenido">
        <Alerta v-if="isError">Todos los campos son requeridos</Alerta>
        <form 
          class="formulario"
          @submit.prevent="cotizarCripto">
          <div class="campo">
              <label for="moneda">Moneda:</label>
              <select 
                id="moneda"
                v-model="cotizacion.moneda">
                  <option value="">-- Selecciona --</option>
                  <option v-for="moneda in monedas" :value="moneda.codigo">
                    {{ moneda.texto }}
                  </option>
              </select>
          </div>
          <div class="campo">
            <label for="cripto">Criptomoneda:</label>
            <select 
              id="cripto"
              v-model="cotizacion.criptomoneda">
                <option value="">-- Selecciona --</option>
                <option v-for="criptomoneda in criptomonedas" :value="criptomoneda.CoinInfo.Name">
                  {{ criptomoneda.CoinInfo.FullName }}
                </option>
            </select>
        </div>

        <input type="submit" value="Cotizar" />
        </form>
        <div 
          class="contenedor-resultado"
          v-if="mostrarResultados"
        >
          <h2>Cotización:</h2>
          <div class="resultado">
            <img 
              :src="'https://cryptocompare.com/'+valor.IMAGEURL" 
              alt="Imagen de resultado"
            >

            <div>
              <p>El precio es de: <span>{{ valor.PRICE }}</span></p>
              <p>El precio más alto del día: <span>{{ valor.HIGHDAY }}</span></p>
              <p>El precio más bajo del día: <span>{{ valor.LOWDAY }}</span></p>
              <p>Variación últimas 24 horas: <span>{{ valor.CHANGEPCT24HOUR }}</span></p>
              <p>Última actualización: <span>{{ valor.LASTUPDATE }}</span></p>
            </div>
          </div>
        </div>
    </div>
  </div>

</template>

