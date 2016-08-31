$(function() {

  $("button").button();
  // $("#symbol").focus();

  //form submit event
  $("form").submit(function(e) {

    e.preventDefault();

    $("button").button("loading");

    var ticker = $("#symbol").val();

    new Markit.QuoteService(ticker, function(jsonResult) {

      this.clearResult();

      //Catch errors
      if (!jsonResult || jsonResult.Message) {
        this.renderAlert(jsonResult);
        return;
      }

      this.success(jsonResult);

    });
  });
});

//prototype some methods onto our Quote Service
Markit.QuoteService.prototype.clearResult = function() {
  this.resetForm();
  $("#resultContainerX").remove();
  $("div.alert").remove();
};

Markit.QuoteService.prototype.resetForm = function() {
  $("button").button("reset");
  $("form").removeClass("error");
  $("#symbol")
    .val($("#symbol").val().toUpperCase())
    .select()
    .focus();
};

Markit.QuoteService.prototype.success = function(jsonResult) {
  var $containerX = $("<div class='' id='resultContainerX' />");
  $containerX.append("<h4>" + jsonResult.Name + " (" + jsonResult.Symbol + ")</h4>");
  $containerX.append(this.renderResultTable(jsonResult));

  $("form").after($containerX);
  $containerX.fadeIn('fast');
  this.resetForm();
};

Markit.QuoteService.prototype.renderAlert = function(jsonResult) {
  $("form").addClass("error");
  $("form").before("<div class='alert alert-error'><a class='close' data-dismiss='alert'>&times;</a>" + jsonResult.Message + "</div>");
  $("div.alert").alert();
};

Markit.QuoteService.prototype.renderResultTable = function(jsonResult) {
  var $table = $("<table />"),
    $thead = $("<thead />"),
    $tbody = $("<tbody />"),
    tableHeadCells = [];
  tableCells = [];

  tableHeadCells.push("<tr>");
  tableHeadCells.push("<th>Last Price</th>");
  tableHeadCells.push("<th>Change</th>");
  tableHeadCells.push("<th>Change Percent</th>");
  tableHeadCells.push("<th>Change Percent YTD</th>");
  tableHeadCells.push("<th>Last Traded</th>");
  tableHeadCells.push("</tr>");

  tableCells.push("<tr>");
  tableCells.push("<td>$", jsonResult.LastPrice, "</td>");
  tableCells.push("<td>", this.formatChgPct(jsonResult.Change), "</td>");
  tableCells.push("<td>", this.formatChgPct(jsonResult.ChangePercent), "%</td>");
  tableCells.push("<td>", jsonResult.ChangePercentYTD.toFixed(2), "%</td>");
  tableCells.push("<td>", jsonResult.Timestamp, "</td>");
  tableCells.push("</tr>");

  $table.addClass("table table-bordered table-striped");
  $thead.append(tableHeadCells.join(""));
  $tbody.append(tableCells.join(""));

  $table.append($thead).append($tbody);

  return $table;
};

Markit.QuoteService.prototype.formatChgPct = function(chg) {
  //the quote API returns negative numbers already,
  //so we just need to add the + sign to positive numbers
  return (chg <= 0) ? chg.toFixed(2) : "+" + chg.toFixed(2);
};
