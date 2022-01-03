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
      default: 10
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
                backgroundColor: '#f87979',
                data: this.y.slice(0, this.maxColumns)
              }
            ]
          },
          {
            responsive: true,
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