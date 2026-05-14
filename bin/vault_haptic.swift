import Cocoa

guard let typeArg = CommandLine.arguments.dropFirst().first else {
    print("Usage: haptic [generic|alignment|levelChange]")
    exit(1)
}

let manager = NSHapticFeedbackManager.defaultPerformer
var pattern: NSHapticFeedbackManager.FeedbackPattern = .generic

switch typeArg {
case "alignment":
    pattern = .alignment
case "levelChange":
    pattern = .levelChange
default:
    pattern = .generic
}

manager.perform(pattern, performanceTime: .default)
