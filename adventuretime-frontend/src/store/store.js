import { createStore } from 'vuex'
import bookingStore from './modules/bookingStore';
import eventStore from './modules/eventStore';

export default createStore({
  modules: {
    bookingStore,
    eventStore
  }
})
