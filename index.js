window.onload = function () {
    var canvas = document.getElementById("myCanvas");
    var ctx = canvas.getContext("2d");
    document.querySelectorAll(".inputs").forEach(function (ele) {
        ele.addEventListener("change", processInputs);
    });
    document.getElementById("rotationSlider").addEventListener("input", rotationSliderChanged);
    document.getElementById("rotationText").addEventListener("change", rotationTextChanged);
    document.querySelectorAll(".triggerRedraw").forEach(function (ele) {
        ele.addEventListener("change", function (event) {
            processInputs();
        });
    });
    function processInputs() {
        var angles = [
            parseFloat(document.getElementById("inA").value),
            parseFloat(document.getElementById("inB").value),
            parseFloat(document.getElementById("inC").value),
        ];
        var lengths = [
            parseFloat(document.getElementById("ina").value),
            parseFloat(document.getElementById("inb").value),
            parseFloat(document.getElementById("inc").value),
        ];
        var triangle = new Triangle(angles, lengths);
        var rotation = parseFloat(document.getElementById("rotation").value);
        if (triangle.haveEnoughInfomation()) {
            writePlaceholders(triangle);
            var dpi = parseFloat(document.getElementById("dpi").value);
            var points = convertTriangleToPoints(triangle.angles, triangle.lengths, dpiToLengthFactor(dpi));
            points = rotatePoints(points, rotation);
            points = shiftPoints(points);
            drawTriangle(points);
        }
    }
    function rotationSliderChanged(e) {
        var rotation = e.target.value;
        var rotationTextEle = document.getElementById("rotationText");
        rotationTextEle.value = rotation;
        var rotationEle = document.getElementById("rotation");
        rotationEle.value = rotation;
        processInputs();
    }
    function rotationTextChanged(e) {
        var rotation = e.target.value;
        var rotationSliderEle = document.getElementById("rotationSlider");
        rotationSliderEle.value = rotation;
        var rotationEle = document.getElementById("rotation");
        rotationEle.value = rotation;
        processInputs();
    }
    function writePlaceholders(triangle) {
        var angle_inputs = document.querySelectorAll(".inputs.angles");
        setPlaceholders(angle_inputs, triangle.angles);
        var length_inputs = document.querySelectorAll(".inputs.lengths");
        setPlaceholders(length_inputs, triangle.lengths);
    }
    function setPlaceholders(inputs, values) {
        for (var i = 0; i < 3; i++) {
            if (inputs[i].value.length == 0 && !isNaN(values[i]))
                inputs[i].placeholder = values[i].toString();
            else
                inputs[i].placeholder = "";
        }
    }
    function dpiToLengthFactor(dpi) {
        return dpi / 2.54;
    }
    function convertTriangleToPoints(angles, lengths, length_factor) {
        var pointA = [0, 0];
        var pointB = [lengths[2] * length_factor, 0];
        var pointC = [
            Math.cos(angles[0] * Math.PI / 180) * lengths[1] * length_factor,
            Math.sin(angles[0] * Math.PI / 180) * lengths[1] * length_factor
        ];
        return [pointA, pointB, pointC];
    }
    function rotatePoints(points, rotation) {
        var rad = rotation * Math.PI / 180;
        for (var i = 0; i < 3; i++) {
            var x = points[i][0];
            var y = points[i][1];
            points[i][0] = x * Math.cos(rad) - y * Math.sin(rad);
            points[i][1] = x * Math.sin(rad) + y * Math.cos(rad);
        }
        return points;
    }
    function shiftPoints(points) {
        var minX = 0;
        var minY = 0;
        points.forEach(function (point) {
            if (point[0] < minX)
                minX = point[0];
            if (point[1] < minY)
                minY = point[1];
        });
        for (var i = 0; i < 3; i++) {
            points[i][0] -= minX;
            points[i][1] -= minY;
        }
        return points;
    }
    function getAngleLabelPoints(points, fontPx) {
        var center = getCenterPoint(points);
        var labelPoints = [];
        points.forEach(function (point) {
            var distance = Math.sqrt(Math.pow((point[0] - center[0]), 2) + Math.pow((point[1] - center[1]), 2));
            var bearing = Math.atan2(point[0] - center[0], point[1] - center[1]);
            var labelDistance = distance + (fontPx * 1.1);
            var pointX = center[0] + Math.sin(bearing) * labelDistance;
            var pointY = center[1] + Math.cos(bearing) * labelDistance;
            labelPoints.push([pointX, pointY]);
        });
        return labelPoints;
    }
    function getCenterPoint(points) {
        var center = [0, 0];
        points.forEach(function (point) {
            center[0] += point[0];
            center[1] += point[1];
        });
        center[0] = center[0] / 3;
        center[1] = center[1] / 3;
        return center;
    }
    function drawTriangle(points) {
        var margin = 50;
        resizeCanvas(canvas, points, margin);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.translate(margin, margin);
        ctx.beginPath();
        ctx.moveTo(points[0][0], points[0][1]);
        ctx.lineTo(points[1][0], points[1][1]);
        ctx.lineTo(points[2][0], points[2][1]);
        ctx.closePath();
        ctx.stroke();
        var labelPoints = getAngleLabelPoints(points, 20);
        if (document.getElementById("angleLables").checked) {
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.font = "20px Arial";
            ctx.fillText(document.getElementById("labelA").value, labelPoints[0][0], labelPoints[0][1]);
            ctx.fillText(document.getElementById("labelB").value, labelPoints[1][0], labelPoints[1][1]);
            ctx.fillText(document.getElementById("labelC").value, labelPoints[2][0], labelPoints[2][1]);
        }
    }
    function resizeCanvas(canvas, points, margin) {
        var maxX = 0;
        var maxY = 0;
        points.forEach(function (point) {
            if (point[0] > maxX)
                maxX = point[0];
            if (point[1] > maxY)
                maxY = point[1];
        });
        canvas.width = maxX + margin * 2;
        canvas.height = maxY + margin * 2;
    }
};
var Triangle = (function () {
    function Triangle(angles, lengths) {
        this.angles = angles;
        this.lengths = lengths;
        for (var i = 0; i < 2; i++) {
            var valid_angles = this.angles.filter(function (x) { return !isNaN(x); });
            var valid_lengths = this.lengths.filter(function (x) { return !isNaN(x); });
            if (valid_angles.length == 2)
                this.applySumOfInteriorAngleRule(valid_angles);
            if (valid_angles.length == 0 && valid_lengths.length == 3)
                this.applyCosineRuleWithLengths();
            if ((valid_angles.length + valid_lengths.length == 3) && this.haveNoPairs())
                this.applyCosineRuleWithAngle();
            this.applySineRule();
        }
    }
    Triangle.prototype.applySumOfInteriorAngleRule = function (valid_angles) {
        var sum = valid_angles.reduce(function (x, y) { return x + y; });
        for (var i = 0; i < 3; i++) {
            if (isNaN(this.angles[i])) {
                this.angles[i] = 180 - sum;
            }
        }
    };
    Triangle.prototype.applySineRule = function () {
        var have_pair = false;
        for (var i = 0; i < 3; i++) {
            if (!isNaN(this.angles[i]) && !isNaN(this.lengths[i])) {
                var k = this.lengths[i] / Math.sin(this.angles[i] * Math.PI / 180);
                have_pair = true;
                break;
            }
        }
        if (!have_pair)
            return;
        for (var i = 0; i < 3; i++) {
            if (!isNaN(this.angles[i]) && isNaN(this.lengths[i])) {
                var length_1 = k * Math.sin(this.angles[i] * Math.PI / 180);
                this.lengths[i] = roundToDecimal(length_1, 5);
            }
            else if (isNaN(this.angles[i]) && !isNaN(this.lengths[i])) {
                var ratio = this.lengths[i] / k;
                var inversed = false;
                if (ratio > 1) {
                    ratio = 1 / ratio;
                    inversed = true;
                }
                var angle = Math.asin(ratio) * 180 / Math.PI;
                if (inversed)
                    angle = 1 / angle;
                this.angles[i] = roundToDecimal(angle, 5);
            }
        }
    };
    Triangle.prototype.applyCosineRuleWithLengths = function () {
        var idx = [0, 1, 2];
        for (var i = 0; i < 2; i++) {
            var a = this.lengths[idx[0]];
            var b = this.lengths[idx[1]];
            var c = this.lengths[idx[2]];
            var cosC = (Math.pow(a, 2) + Math.pow(b, 2) - Math.pow(c, 2)) / (2 * a * b);
            var angC = Math.acos(cosC) * 180 / Math.PI;
            this.angles[idx[2]] = roundToDecimal(angC, 5);
            idx.push(idx.shift());
        }
    };
    Triangle.prototype.applyCosineRuleWithAngle = function () {
        var idx = [];
        for (var i = 0; i < 3; i++) {
            if (isNaN(this.angles[i]) && !isNaN(this.lengths[i]))
                idx.unshift(i);
            else if (!isNaN(this.angles[i]) && isNaN(this.lengths[i]))
                idx.push(i);
        }
        var a = this.lengths[idx[0]];
        var b = this.lengths[idx[1]];
        var angC = this.angles[idx[2]];
        var c = Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2) - 2 * a * b * Math.cos(angC * Math.PI / 180));
        this.lengths[idx[2]] = roundToDecimal(c, 5);
    };
    Triangle.prototype.haveNoPairs = function () {
        for (var i = 0; i < 3; i++) {
            if (!isNaN(this.angles[i]) && !isNaN(this.lengths[i]))
                return false;
        }
        return true;
    };
    Triangle.prototype.haveEnoughInfomation = function () {
        if ((!isNaN(this.angles[0]) && !isNaN(this.lengths[1])) && !isNaN(this.lengths[2]))
            return true;
        return false;
    };
    return Triangle;
}());
function roundToDecimal(x, n) {
    var k = Math.pow(10, n);
    return Math.round(x * k) / k;
}
//# sourceMappingURL=index.js.map