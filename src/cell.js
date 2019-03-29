function Cell(x, y, size) {
    this.x = x;
    this.y = y;
    this.size = size;

    this.alive = false;
    this.hovered = false;

    this.render = function() {
        if (this.alive) {
            if (this.hovered) fill(255, 255, 255, 200);
            else fill(255);
            noStroke();
        }
        else {
            if (this.hovered) fill(255, 255, 255, 100);
            else noFill();
            noStroke();
        }
        rect(this.x * size, this.y * size, size, size);
    }

    // Returns true if the cursor is in front of the Cell
    this.isBehindCursor = function() {
        return mouseX >= this.x * this.size
            && mouseX < (this.x * this.size) + this.size
            && mouseY >= this.y * this.size
            && mouseY < (this.y * this.size) + this.size;
    }

    // Returns a new Cell that is identical to this one
    this.deepCopy = function() {
        let result = new Cell(this.x, this.y, this.size);
        result.alive = this.alive;
        result.hovered = this.hovered;
        return result;
    }
}//end Cell