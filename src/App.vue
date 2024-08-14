<script setup>
  import { ref, reactive, computed } from 'vue';
  import Alerta from './Components/Alerta.vue';
  import Spinner from './components/Spinner.vue';
  import useCripto from './composables/useCripto';

  const { monedas, criptomonedas, valor, cargando, obtenerCotizacion, mostrarResultados } = useCripto();

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

  const cotizarCripto = () => {
    if(Object.values(cotizacion).includes('')){
      console.log('Este es un mensaje de error');
      error.value = true;
      setTimeout(()=>{
        error.value = false;
      }, 2000);
      return;
    }

    obtenerCotizacion(cotizacion);
  };

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

        <Spinner v-if="cargando"/>

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

