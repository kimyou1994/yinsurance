#
# This is a Shiny web application. You can run the application by clicking
# the 'Run App' button above.
#
# Find out more about building applications with Shiny here:
#
#    http://shiny.rstudio.com/
#
library(shinydashboard)
library(shiny)
library(gbm)
library(data.table)

# Define UI for application that draws a histogram
ui <- fluidPage(
   
   # Application title
  # titlePanel("Insurance Estimate"),
   
   # Sidebar with a slider input for number of bins 
   dashboardPage(
     dashboardHeader(title = "Insurance Estimate"),
      dashboardSidebar(
        textInput("name", h3("Name"), 
                  value = "Enter name..."),
        textInput("age", h3("Age"), 
                  value = "20"),
        fluidRow(
          column(6, 
                 numericInput("lb", 
                              h3("Weight"), 
                              value = 100)),
          column(6, 
                 numericInput("inch", 
                              h3("Height"), 
                              value = 100
                              )) 
        ),
        fluidRow(
            column(6, checkboxInput("smoke", "Smoking?")),
            column(6, checkboxInput("marry", "Married?"))
        ),
        radioButtons("gender", h3("Gender"),
                     choices = list("Male" = 0, "Female" = 1),selected = 0),
        numericInput("income", 
                     h3("Income"), 
                     value = 50000
        ),
        numericInput("insured", 
                     h3("Insured Amount"), 
                     value = 500000
        ),
        selectInput("state", h3("Select box"), 
                    choices = list("Alabama" = 0, "Alaska" = 1, "Arizona" = 2, "Arkansas" = 3 , "California" = 4,
                                   "Colorado" = 5, "Connecticut" = 6, "Delaware" = 7, "Florida" = 8, "Georgia" = 9,
                                   "Hawaii" = 11, "Idaho" = 12, "Illinois" = 13, "Indiana" = 14, "Iowa" = 15, 
                                   "Kansas" = 16, "Kentucky" = 17, "Louisiana" = 18, "Maine" = 19, "Maryland" = 20,
                                   "Massachusetts" = 21, "Michigan" = 22, "Minnesota" = 23, "Mississippi" = 24,
                                   "Missouri" = 25, "Montana" = 26, "Nebraska" = 27, "Nevada" = 28, "New Hampshire" = 29,
                                   "New Jersey" = 30, "New Mexico" = 31, "New York" = 32, "North Carolina" = 33,
                                   "North Dakota" = 34, "Ohio" = 35, "Oklahoma" = 36, "Oregon" = 37, "Pennsylvania" = 38,
                                   "Rhode Island" = 39, "South Carolina" = 40, "South Dakota" = 41, "Tennessee" = 42, "Texas" = 43,
                                   "Utah" = 44,"Vermont" = 45, "Virginia" = 46, "Washington" = 47, "West Virginia" = 48, "Wisconsin" = 49,
                                   "Wyoming" = 50) , selected = 0),
        h3("Pre-Condition"),
        fluidRow(
          column(6, checkboxInput("hepB", "Chronic viral hepatitis B without delta-agent")),
          column(6,
            conditionalPanel(
              condition = "input.hepB == true",
              selectInput("hepBlevel", "Condition",
                          list("Low", "Medium", "High"))
            ))
        ),
        fluidRow(
          column(6, checkboxInput("cPalsy", "Ataxic cerebral palsy")),
          column(6,
            conditionalPanel(
              condition = "input.cPalsy == true",
              selectInput("cPalsylevel", "Condition",
                          list("Low", "Medium", "High"))
            ))
        ),
        fluidRow(
          column(6, checkboxInput("diarrhea", "Diarrhea")),
          column(6,
                 conditionalPanel(
                   condition = "input.diarrhea == true",
                   selectInput("diarrhealevel", "Condition",
                               list("Low", "Medium", "High"))
                 ))
        ),
        fluidRow(
          column(6, checkboxInput("tachycardia", "Tachycardia")),
          column(6,
                 conditionalPanel(
                   condition = "input.tachycardia == true",
                   selectInput("tachycardialevel", "Condition",
                               list("Low", "Medium", "High"))
                 ))
        ),
        fluidRow(
          column(6, checkboxInput("apnea", "Obstructive Sleep Apnea")),
          column(6,
                 conditionalPanel(
                   condition = "input.apnea == true",
                   selectInput("apnealevel", "Condition",
                               list("Low" = 5, "Medium" = 10, "High" = 15))
                 ))
        ),
        fluidRow(
          column(6, checkboxInput("fracture", "Unspecified fracture of specified metacarpal bone with unspecified laterality")),
          column(6,
                 conditionalPanel(
                   condition = "input.fracture == true",
                   selectInput("fracturelevel", "Condition",
                               list("Low", "Medium", "High"))
                 ))
        ),
        fluidRow(
          column(6, checkboxInput("heartbeat", "Other abnormalities of heart beat")),
          column(6,
                 conditionalPanel(
                   condition = "input.heartbeat == true",
                   selectInput("heartbeatlevel", "Condition",
                               list("Low", "Medium", "High"))
                 ))
        ),
        fluidRow(
          column(6, checkboxInput("type2", "Type 2 diabetes mellitus with hyperglycemia")),
          column(6,
                 conditionalPanel(
                   condition = "input.type2 == true",
                   selectInput("type2level", "Condition",
                               list("Low", "Medium", "High"))
                 ))
        ),
        fluidRow(
          column(6, checkboxInput("hiv", "HIV disease resulting in other bacterial infections")),
          column(6,
                 conditionalPanel(
                   condition = "input.hiv == true",
                   selectInput("hivlevel", "Condition",
                               list("Low", "Medium", "High"))
                 ))
        ),
        fluidRow(
          column(6, checkboxInput("hemorrhage", "cough with hemorrhage")),
          column(6,
                 conditionalPanel(
                   condition = "input.hemorrhage == true",
                   selectInput("hemorrhagelevel", "Condition",
                               list("Low", "Medium", "High"))
                 ))
        ),
        actionButton("estimate", "Estimate")
      ),
      
      # Show a plot of the generated distribution
      dashboardBody(
        textOutput("selected_hemorrhage")
      )
   )
)

# Define server logic required to draw a histogram
server <- function(input, output) {
  observeEvent(input$estimate, {
    output$name <- renderText({input$name})
    smoking <- 0
    if (input$smoke == TRUE) {
      smoking <- 1
    }
    married <- 0
    if (input$marry == TRUE) {
      married <- 1
    }
    hepb <- 0
    if (input$hepB == TRUE) {
      if (input$hemorrhagelevel == "Low") {
        hepb <- 5
      }else if (input$hemorrhagelevel == "Medium") {
        hepb <- 10
      }else {
        hepb <- 15
      }
    }
    cparsy <- 0
    if (input$cPalsy == TRUE) {
      if (input$cParlylevel == "Low") {
        cparsy <- 5
      }else if (input$cParlylevel == "Medium") {
        cparsy <- 10
      }else {
        cparsy <- 15
      }
    }
    diarr <- 0
    if (input$diarrhea == TRUE) {
      if (input$diarrhea == "Low") {
        diarr <- 5
      }else if (input$diarrhealevel == "Medium") {
        diarr <- 10
      }else {
        diarr <- 15
      }
    }
    tachy <-0
    if (input$tachycardia == TRUE) {
      if (input$tachycardia == "Low") {
        tachy <- 5
      }else if (input$tachycardialevel == "Medium") {
        tachy <- 10
      }else {
        tachy <- 15
      }
    }
    apn <- 0
    if (input$apnea == TRUE) {
      if (input$apnea == "Low") {
        apn <- 5
      }else if (input$apnealevel == "Medium") {
        apn <- 10
      }else {
        apn <- 15
      }
    }
    frac <- 0
    if (input$fracture == TRUE) {
      if (input$fracture == "Low") {
        frac <- 5
      }else if (input$fracturelevel == "Medium") {
        frac <- 10
      }else {
        frac <- 15
      }
    }
    heart <- 0
    if (input$heartbeat == TRUE) {
      if (input$heartbeat == "Low") {
        heart <- 5
      }else if (input$heartbeatlevel == "Medium") {
        heart <- 10
      }else {
        heart <- 15
      }
    }
    ty2 <- 0
    if (input$type2 == TRUE) {
      if (input$type2 == "Low") {
        ty2 <- 5
      }else if (input$type2level == "Medium") {
        ty2 <- 10
      }else {
        ty2 <- 15
      }
    }
    hv <- 0
    if (input$hiv == TRUE) {
      if (input$hiv == "Low") {
        hv <- 5
      }else if (input$hivlevel == "Medium") {
        hv <- 10
      }else {
        hv <- 15
      }
    }
    hem <- 0
    if (input$hemorrhage == TRUE) {
      if (input$hemorrhage == "Low") {
        hem <- 5
      }else if (input$hemorrhagelevel == "Medium") {
        hem <- 10
      }else {
        hem <- 15
      }
    }
    stateincome <- c(44765,73355,51492,41995,64500,63909,71346,61255,49426,51244,73487,48275,59588,50532,54736,53906,45215,45727,51494,75847
                     , 70628,51494,75847,70628,51084,63488,40593,50238,49509,54996,52431,70303,72222,45382,60850,47830,60557,51075,48568,54148,
                     55702,58073,47238,53017,47275,55653,62912,56990,66262,64129,42019,55638,60214)
    differenceincome <- as.integer(input$income) - stateincome[as.integer(input$state) + 1] 
    bmi <- as.integer(input$lb)/(as.integer(input$inch)* as.integer(input$inch))*703
    val <- c(0, age=as.integer(input$age), input$gender, input$state, input$income, input$insured, input$inch, input$lb, smoking, married, hepb, cparsy,
             diarr, tachy, apn, frac, heart, ty2, hv, 20,20,40,30,70, 40, 110, 0, stateincome[as.integer(input$state) + 1], differenceIncome=differenceincome, bmi )
    print(val)
    new.plan = data.frame(wt=val)
    model <- readRDS("model2.rds")
    #model.gbm <- load(path.expand("~/model2.Rdata"))
    "predict"(model.gbm, newdata=new.plan, n.trees=300)
    
  })
  output$selected_hemorrhage <- renderText({ 
    paste("You have selected", input$hemorrhagelevel)
  })
  
}

# Run the application 
shinyApp(ui = ui, server = server)

