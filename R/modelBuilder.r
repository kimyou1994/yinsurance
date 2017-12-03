library(data.table)
library(xgboost)
library(gbm)

X <- fread("states.csv")

model.gbm <- gbm(purchased ~ ., data=X[, !(colnames(X) %in% c("id", "state")), with=FALSE], distribution = "multinomial", n.trees=300,
                 interaction.depth = 3, shrinkage = 0.001, cv.folds = 3, verbose = TRUE)

ntree <- gbm.perf(model.gbm, method = "cv")


model.gbm <- gbm(purchased ~ ., data=X[, !(colnames(X) %in% c("id", "state")), with=FALSE], distribution = "multinomial", n.trees=ntree,
                 interaction.depth = 3, shrinkage = 0.001, verbose = TRUE)

#Variable importance
summary(model.gbm)

#Parcial dependence
plot(model.gbm, "bmi", n.trees=ntree)
plot(model.gbm, "diffIncome", n.trees=ntree)
plot(model.gbm, "weight", n.trees=ntree)
plot(model.gbm, "`s-b`", n.trees=ntree)

# Explore the data


ans <- X[, list(pct_platinum = mean(purchased == 3),
                pct_gold     = mean(purchased == 2),
                pct_silver   = mean(purchased == 1),
                pct_bronze   = mean(purchased == 0)
                ), by=list(is_obese = (weight > 270))]

ans <- X[, list(pct_platinum = mean(purchased == 3),
                pct_gold     = mean(purchased == 2),
                pct_silver   = mean(purchased == 1),
                pct_bronze   = mean(purchased == 0)
                ), by=cut(bmi, breaks=c(0, 18.5, 24.5, 30, 40))]


# Predict and write to file
p <- predict(model.gbm, newdata = X, n.trees=ntree, type="response")
P <- data.frame(p)
colnames(P) <- c("bronze", "silver", "gold", "platinum")

X_out <- cbind(X, P)
fwrite(X_out, file="scored_states-bmi.csv")