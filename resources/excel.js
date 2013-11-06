var config = {
  "title": "Excel Exam Jeopardy",
  "columns": ["Cell","Formatting","Formulas","Charts","Misc."],
  "example_file": {"file":"resources/ExcelReview.xlsx", "text":"Example Excel File"}
}

var theData = {
      "one": {
        "one": "Change the color of the text in cell A1 to standard blue",
        "two": "Change the width of the B column to automatically fit the widest entry in the column",
        "three": "Fill the empty cells using the formula from E3",
        "four": "Resize the chart so it covers cells A1 to L30",
        "five": "Use AutoFill to continue the numeric series in the cells (B3:B4) down to B8"
      },
      "two":{
        "one": "Indent the contents in the cells (F3:F8) to the first indent position",
        "two": "Change the format of cells (D3:D8) to ACCOUNTING",
        "three": "Without moving the cursor cell, type the formula that will divide cell C10 by 6. Do NOT use spaces in the formula",
        "four": "Insert a 3-D Clustered Column chart using the data from (D3:D8)",
        "five": "Insert two rows above 2 and 3. Do NOT use Control shortcuts"
      },
      "three": {
        "one": "Specify that the cell address in cell H3 WILL change if copied to another cell. Press ENTER when done",
        "two": "Merge the cells (A1:F1) and center the text",
        "three": "Use the worksheet function to fill cell D11 with the average of cells (D3:D8). Do NOT list cells individually",
        "four": "Create a 3-D pie chart (NOT an exploded 3-D pie chart) based on the data in cells (D3:D8)",
        "five": "Create a linetype sparkline in cell G3 using the data from cells B3-D3 "
      },
      "four": {
        "one": "Specify that the formula in cell I3 will always multiply by cell B13 even if pasted into another cell. Press ENTER when done",
        "two": "Rotate the text in cell G2 45 degrees counterclockwise",
        "three": "Use the Worksheet function to fill cells J3-J8 with \"Y\" if cell C3 grater than cell B3 and \"N\" if cell B3 less than cell C3. No NOT use spaces in the formula. (Bonus: (100) Use AutoFill to complete the logical function for that column) ",
        "four": "Specify the selected chart display on a new sheet in the current workbook tited Chart2",
        "five": "Specify the cells in rane C3:C8 whose value is greater than  or equal to 7 are green, greater than or equal to 5 are yellow, and the rest are red. The format them with the 3 arrows (colored) Icon Set"
      },
      "five": {
        "one": "Add data bars to cells L3:L8 using the Gradient Fill Red Data Bar style, then deselect the cells to view the data bars",
        "two": "Format cells D3-D8 so that they will show two decimal places",
        "three": "Use a worksheet function to calculate payments for a loan using a constant monthly interest rate of .5% with 12 monthly payments, and a present loan value of $100,000. (Do not click to select the values in the cells, type in the values.",
        "four": "Create a 2-D pie chart based on the data in cells D3-D8, then move the chart to a new sheet named Chart1",
        "five": "Explode the Blue portion of the chart by 20%"
      }
    }