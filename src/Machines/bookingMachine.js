import {  assign,createMachine } from "xstate";
import { fetchCountries } from "../utils/api";
const fillCountries = {
  initial: "loading",
  states: {
    loading: {
     invoke:{
       id: 'getCountries',
       src: () =>fetchCountries,
       onDone:{
        target:'success',
        actions: assign({
          countries:(context, event)=> event.data,
          
        })
       },
       onError:{
         target:'failure',
         actions:assign({
           error:'fallo el request',
         })
       }
     }
    },
    success: {},
    failure: {
      on: {
        RETRY: { target: "loading" },
      },
    },
  },
};

const bookingmachine = createMachine({
  id: "buy plane tickets",
  initial: "inicial",
  context:{
    passengers:[],
    selectedCountry:'',
    countries:[],
    error:'',
  },
  states: {
    inicial: {
      on: {
        START: {
          target: "search",
        },
      },
    },
    search: {
      on: {
        CONTINUE:{
          target:"passengers",
          actions:assign({
              selectedCountry:(context, event)=>event.selectedCountry,
          })
        },
        CANCEL:{
          target:'inicial',
          actions:'cleanContext',
        }
      },
      ...fillCountries,
    },
    passengers: {
      on: {
        DONE:{
          target:"tickets",
          cond:'moreThan0Passenger'
        },
        CANCEL: {
          target: "inicial",
          actions: "cleanContext",
        },
        ADD:{
          target:'passengers',
          actions:assign(
            (context,event) => context.passengers.push(event.newPassenger)
          ),
        }
      },
    },
    tickets: {
      after:{
        5000:{
          target:'inicial',
          actions: "cleanContext",
        }
      },
      on:{
        FINISH:"inicial",
      }
    },
  },
},
{
  actions:{
   cleanContext: assign({
    selectedCountry:'',
    passengers:[],
   })
  },
  guards:{
    moreThan0Passenger:(context)=>{
      return context.passengers.length > 0;
    }
  }
}
);

export default bookingmachine;