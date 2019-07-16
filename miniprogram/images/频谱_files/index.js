import Kiddio from '/src/kiddio.js';

document.addEventListener('DOMContentLoaded', function() {
    new Kiddio({
        url: '../media/demo.wav',
        container: '#frequncy'
    });
});
