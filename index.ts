window.onload = () => {
    var canvas = document.getElementById("myCanvas") as HTMLCanvasElement
    var ctx = canvas.getContext("2d")
    document.querySelectorAll(".inputs").forEach(ele => {
        ele.addEventListener("change", processInputs)
    })
    document.getElementById("rotationSlider").addEventListener("input", rotationSliderChanged)
    document.getElementById("rotationText").addEventListener("change", rotationTextChanged)
    document.querySelectorAll(".triggerRedraw").forEach(ele => {
        ele.addEventListener("change", event => {
            tryDrawTriangle()
        })
    })

    function processInputs() {
        let angles = [
            parseFloat((document.getElementById("inA") as HTMLInputElement).value),
            parseFloat((document.getElementById("inB") as HTMLInputElement).value),
            parseFloat((document.getElementById("inC") as HTMLInputElement).value),
        ]
        let lengths = [
            parseFloat((document.getElementById("ina") as HTMLInputElement).value),
            parseFloat((document.getElementById("inb") as HTMLInputElement).value),
            parseFloat((document.getElementById("inc") as HTMLInputElement).value),
        ]

        for (let i = 0; i < 2; i++) {
            let valid_angles = angles.filter(x => !isNaN(x))
            let valid_lengths = lengths.filter(x => !isNaN(x))
            if (valid_angles.length == 2) applySumOfInteriorAngleRule(angles, valid_angles)
            if (valid_angles.length == 0 && valid_lengths.length == 3) applyCosineRuleWithLengths(angles, lengths)
            if ((valid_angles.length + valid_lengths.length == 3) && haveNoPairs(angles, lengths)) applyCosineRuleWithAngle(angles, lengths)
            applySineRule(angles, lengths)
        }

        writeToHidden(angles, lengths)
        tryDrawTriangle()
    }

    function rotationSliderChanged(e: Event) {
        const rotation = (e.target as HTMLInputElement).value
        const rotationTextEle = document.getElementById("rotationText") as HTMLInputElement
        rotationTextEle.value = rotation
        const rotationEle = document.getElementById("rotation") as HTMLInputElement
        rotationEle.value = rotation

        tryDrawTriangle()
    }

    function rotationTextChanged(e: Event) {
        const rotation = (e.target as HTMLInputElement).value
        const rotationSliderEle = document.getElementById("rotationSlider") as HTMLInputElement
        rotationSliderEle.value = rotation
        const rotationEle = document.getElementById("rotation") as HTMLInputElement
        rotationEle.value = rotation

        tryDrawTriangle()
    }

    function applySumOfInteriorAngleRule(angles: number[], valid_angles: number[]) {
        const sum = valid_angles.reduce((x, y) => x + y)
        for (let i = 0; i < 3; i++) {
            if (isNaN(angles[i])) {
                angles[i] = 180 - sum
            }
        }
    }

    function applySineRule(angles: number[], lengths: number[]) {
        let have_pair = false
        for (let i = 0; i < 3; i++) {
            if (!isNaN(angles[i]) && !isNaN(lengths[i])) {
                var k = lengths[i] / Math.sin(angles[i] * Math.PI / 180)
                have_pair = true
                break
            }
        }

        if (!have_pair) return

        for (let i = 0; i < 3; i++) {
            if (!isNaN(angles[i]) && isNaN(lengths[i])) {
                let length = k * Math.sin(angles[i] * Math.PI / 180)
                lengths[i] = roundToDecimal(length, 5)
            }
            else if (isNaN(angles[i]) && !isNaN(lengths[i])) {
                let ratio = lengths[i] / k
                let inversed = false
                if (ratio > 1) {
                    ratio = 1 / ratio
                    inversed = true
                }
                let angle = Math.asin(ratio) * 180 / Math.PI
                if (inversed) angle = 1 / angle
                angles[i] = roundToDecimal(angle, 5)
            }
        }
    }

    function applyCosineRuleWithLengths(angles: number[], lengths: number[]) {
        let idx = [0, 1, 2]
        for (let i = 0; i < 2; i++) {
            let a = lengths[idx[0]]
            let b = lengths[idx[1]]
            let c = lengths[idx[2]]

            let cosC = (a ** 2 + b ** 2 - c ** 2) / (2 * a * b)
            let angC = Math.acos(cosC) * 180 / Math.PI
            angles[idx[2]] = roundToDecimal(angC, 5)
            idx.push(idx.shift())
        }
    }

    function applyCosineRuleWithAngle(angles: number[], lengths: number[]) {
        let idx = []
        for (let i = 0; i < 3; i++) {
            if (isNaN(angles[i]) && !isNaN(lengths[i])) idx.unshift(i)
            else if (!isNaN(angles[i]) && isNaN(lengths[i])) idx.push(i)
        }
        let a = lengths[idx[0]]
        let b = lengths[idx[1]]
        let angC = angles[idx[2]]

        let c = Math.sqrt(a ** 2 + b ** 2 - 2 * a * b * Math.cos(angC * Math.PI / 180))
        lengths[idx[2]] = roundToDecimal(c, 5)
    }

    function haveNoPairs(angles: number[], lengths: number[]) {
        for (let i = 0; i < 3; i++) {
            if (!isNaN(angles[i]) && !isNaN(lengths[i])) return false
        }
        return true
    }

    function haveEnoughInfomation(angles: number[], lengths: number[]) {
        if ((!isNaN(angles[0]) && !isNaN(lengths[1])) && !isNaN(lengths[2])) return true
        return false
    }

    function roundToDecimal(x: number, n: number) {
        let k = 10 ** n
        return Math.round(x * k) / k
    }

    function writeToHidden(angles: number[], lengths: number[]) {
        (document.getElementById("angA") as HTMLInputElement).value = angles[0].toString();
        (document.getElementById("angB") as HTMLInputElement).value = angles[1].toString();
        (document.getElementById("angC") as HTMLInputElement).value = angles[2].toString();
        (document.getElementById("lena") as HTMLInputElement).value = lengths[0].toString();
        (document.getElementById("lenb") as HTMLInputElement).value = lengths[1].toString();
        (document.getElementById("lenc") as HTMLInputElement).value = lengths[2].toString();

        const angle_inputs = document.querySelectorAll(".inputs.angles") as NodeListOf<HTMLInputElement>
        setPlaceholders(angle_inputs, angles)
        const length_inputs = document.querySelectorAll(".inputs.lengths") as NodeListOf<HTMLInputElement>
        setPlaceholders(length_inputs, lengths)
    }

    function setPlaceholders(inputs: NodeListOf<HTMLInputElement>, values: number[]) {
        for (let i = 0; i < 3; i++) {
            if (inputs[i].value.length == 0 && !isNaN(values[i]))
                inputs[i].placeholder = values[i].toString();
            else
                inputs[i].placeholder = ""
        }
    }

    function tryDrawTriangle() {
        const angles = [
            parseFloat((document.getElementById("angA") as HTMLInputElement).value),
            parseFloat((document.getElementById("angB") as HTMLInputElement).value),
            parseFloat((document.getElementById("angC") as HTMLInputElement).value)
        ]
        const lengths = [
            parseFloat((document.getElementById("lena") as HTMLInputElement).value),
            parseFloat((document.getElementById("lenb") as HTMLInputElement).value),
            parseFloat((document.getElementById("lenc") as HTMLInputElement).value)
        ]
        const rotation = parseFloat((document.getElementById("rotation") as HTMLInputElement).value)
        if (haveEnoughInfomation(angles, lengths)) {
            const dpi = parseFloat((document.getElementById("dpi") as HTMLInputElement).value)
            let points = convertTriangleToPoints(angles, lengths, dpiToLengthFactor(dpi))
            points = rotatePoints(points, rotation)
            points = shiftPoints(points)
            drawTriangle(points)
        }
    }

    function dpiToLengthFactor(dpi: number) {
        return dpi / 2.54
    }

    function convertTriangleToPoints(angles: number[], lengths: number[], length_factor: number) {
        let pointA = [0, 0]
        let pointB = [lengths[2] * length_factor, 0]
        let pointC = [
            Math.cos(angles[0] * Math.PI / 180) * lengths[1] * length_factor,
            Math.sin(angles[0] * Math.PI / 180) * lengths[1] * length_factor
        ]

        return [pointA, pointB, pointC]
    }

    function rotatePoints(points: number[][], rotation: number) {
        let rad = rotation * Math.PI / 180
        for (let i = 0; i < 3; i++) {
            let x = points[i][0]
            let y = points[i][1]
            points[i][0] = x * Math.cos(rad) - y * Math.sin(rad)
            points[i][1] = x * Math.sin(rad) + y * Math.cos(rad)
        }

        return points
    }

    function shiftPoints(points: number[][]) {
        let minX = 0
        let minY = 0
        points.forEach(point => {
            if (point[0] < minX) minX = point[0]
            if (point[1] < minY) minY = point[1]
        })

        for (let i = 0; i < 3; i++) {
            points[i][0] -= minX
            points[i][1] -= minY
        }

        return points
    }

    function getAngleLabelPoints(points: number[][], fontPx: number) {
        let center = getCenterPoint(points)
        let labelPoints: number[][] = [];
        points.forEach(point => {
            let distance = Math.sqrt((point[0] - center[0]) ** 2 + (point[1] - center[1]) ** 2)
            let bearing = Math.atan2(point[0] - center[0], point[1] - center[1])
            let labelDistance = distance + (fontPx * 1.1)
            let pointX = center[0] + Math.sin(bearing) * labelDistance
            let pointY = center[1] + Math.cos(bearing) * labelDistance
            labelPoints.push([pointX, pointY])
        })
        return labelPoints
    }

    function getCenterPoint(points: number[][]) {
        let center = [0, 0]
        points.forEach(point => {
            center[0] += point[0]
            center[1] += point[1]
        })
        center[0] = center[0] / 3
        center[1] = center[1] / 3
        return center
    }

    function drawTriangle(points: number[][]) {
        const margin = 50
        resizeCanvas(canvas, points, margin)

        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.translate(margin, margin)
        ctx.beginPath()
        ctx.moveTo(points[0][0], points[0][1])
        ctx.lineTo(points[1][0], points[1][1])
        ctx.lineTo(points[2][0], points[2][1])
        ctx.closePath()
        ctx.stroke()

        const labelPoints = getAngleLabelPoints(points, 20)
        if ((document.getElementById("angleLables") as HTMLInputElement).checked) {
            ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        ctx.font = "20px Arial"
        ctx.fillText((document.getElementById("labelA") as HTMLInputElement).value, labelPoints[0][0], labelPoints[0][1])
        ctx.fillText((document.getElementById("labelB") as HTMLInputElement).value, labelPoints[1][0], labelPoints[1][1])
        ctx.fillText((document.getElementById("labelC") as HTMLInputElement).value, labelPoints[2][0], labelPoints[2][1])
        }
    }

    function resizeCanvas(canvas: HTMLCanvasElement, points: number[][], margin: number) {
        let maxX = 0
        let maxY = 0
        points.forEach(point => {
            if (point[0] > maxX) maxX = point[0]
            if (point[1] > maxY) maxY = point[1]
        })
        canvas.width = maxX + margin * 2
        canvas.height = maxY + margin * 2
    }
}