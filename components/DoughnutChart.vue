<script>

import { Doughnut } from 'vue-chartjs'

export default {
  extends: Doughnut,
  props: {
    x: {
      type: Array,
      required: true
    },
    y: {
      type: Array,
      required: true
    },
    label: {
      type: String,
      required: true
    },
    hoverOffset: {
      type: Number,
      required: false,
      default: 4
    },
  },
  watch: {
    x () {
      this.displayGraph()
    },
    y () {
      this.displayGraph()
    }
  },
  mounted () {
    this.displayGraph()
  },
  methods: {
    displayGraph () {
      if (this.x) {
        this.renderChart(
          {
            labels: this.x,
            datasets: [
              {
                label: this.label,
                data: this.y,
                hoverOffset: this.hoverOffset,
                backgroundColor: [
                    'rgb(224, 26, 79)',
                    'rgb(241, 89, 70)',
                    'rgb(249, 194, 46)',
                    'rgb(83, 179, 203)',
                    'rgb(194, 211, 205)',
                    'rgb(175, 191, 192)',
                    'rgb(159, 164, 208)',
                    'rgb(91, 140, 90)'
                ]
              }
            ]
          },
          {
            responsive: false,
            maintainAspectRatio: true,
            legend: {
              labels: {
                fontColor: 'black'
              }
            }
          }
        )
      }
    }
  }
}

</script>