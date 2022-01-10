<script>

import { Bar } from 'vue-chartjs'

export default {
  extends: Bar,
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
    maxColumns: {
      type: Number,
      default: 50
    },
    yPrecision: {
      type: Number,
      default: 0
    }
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
            labels: this.x.slice(0, this.maxColumns),
            datasets: [
              {
                label: this.label,
                data: this.y.slice(0, this.maxColumns),
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
            },
            scales: {
              yAxes: [
                {
                  ticks: {
                    beginAtZero: true,
                    min: 0,
                    fontColor: 'black',
                    precision: this.yPrecision
                  }
                }
              ],
              xAxes: [
                {
                  ticks: {
                    fontColor: 'black'
                  }
                }
              ]
            }
          }
        )
      }
    }
  }
}

</script>