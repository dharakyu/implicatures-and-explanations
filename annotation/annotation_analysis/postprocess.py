import pandas as pd

df = pd.read_csv(r'preprocessed_data.csv')
# print(df)

entry_spans = ""  
exit_spans = ""
bracket_opened = False
span_entrance = False
span_end = False
highlight = False
string = ""
bin_data = []

# comment out
saved_string = ""

for index, row in df.iterrows():
    # print("")
    # print(row['cleaned'])
    # print(len(row['cleaned']))
    # print(row['story_clean'])
    # print(len(row['story_clean']))
    string = ""
    saved_string = ""
    for character in row['cleaned']:
        # print(character)
        if (character == "<"):
            bracket_opened = True
        elif (bracket_opened == True):
            bracket_opened = False
            if (character == "s"):
                entry_spans += "<"
                exit_spans += "<"
                span_entrance = True
            else:
                exit_spans = exit_spans[:-1]
                span_end = True
                if (len(exit_spans) == 0):
                    highlight = False
        elif ((character == ">") & (span_end == True)):
            span_end = False
        elif ((character == ">") & (span_entrance == True) & (span_end != True)):
            entry_spans = entry_spans[:-1]
            if (len(entry_spans) == 0):
                span_entrance = False
                highlight = True
        elif ((highlight == True) & (span_entrance != True) & (span_end != True)):
            string += str(1)
            # comment out
            saved_string += character
        elif ((highlight == False) & (span_entrance != True) & (span_end != True)):
            string += str(0)
            # comment out
            saved_string += character
        else:
            pass

    bin_data.append(string)
    # comment out
    # # print(len(row['story']))
    # print(len(row['story_clean']))
    # # print(len(row['cleaned']))
    # print(len(saved_string))
    # print(len(string))

    # # print(row['story'])
    # print(row['story_clean'])
    # print(row['cleaned'])
    # print(saved_string)
    # print(string)
    # print("")
    # print("")
    # print("")

df['Bin_data'] = bin_data

df.to_csv(r'postprocessed_data.csv')


#####


# it should show H345i (where the numbers are highlighted)
# ex_string = "H<s1<s>2</>>3<s>4</>5</>i"

# ex_string = "Hillsborough County Sheriff's detectives have arrested a personal trainer for&nbsp;the <span class=\"selectedText\" title=\"alleged sexual battery of a female client.\nJames Elbert Williams, 39, was arrested shortly before 2 p.m. at his Cory Lake Drive residence in New Tampa.\n<span class=&quot;selectedText&quot; title=&quot;&quot;></span>The alleged incident occurred Monday at the suspect's business,\">alleged sexual battery of a female client.\nJames Elbert Williams, 39, was arrested shortly before 2 p.m. at his Cory Lake Drive residence in New Tampa.\n<span class=\"selectedText\" title=\"\"></span>The alleged incident occurred Monday at the suspect's business,</span>&nbsp;Club Tone, 5038 Linebaugh Ave. An adult female told&nbsp;detectives she hired Williams as a personal trainer and met him at his&nbsp;studio that morning. During a personal training session the woman was&nbsp;sexually battered, according to police.\nWilliams was booked at the Orient Road Jail this afternoon. Bond is set at $50,500.\nDetectives are asking for anyone who has had contact with the suspect and&nbsp;believes they may be a victim of a crime to contact the Sheriff's Office at&nbsp;(813) 247-8200."

# ex_string = "<span class=\"selectedText\" title=\"Atlanta Police have arrested a man in connection with an \nalleged sexual assault at Dragon Con\n, the Atlanta Journal Constitution reports. \nAtlanta Police confirmed to the AJC that an arrest had been made. \nA friend of the victim took a photo of the suspect that police distributed in an attempt to identify him. Gary Jefferson Hood was taken into custody on Thursday, the AJC reports. \nThe alleged sexual assault took place at Dragon Con on Sept. 5 after the woman began feeling dizzy and unwell at a panel.\">Atlanta Police have arrested a man in connection with an \nalleged sexual assault at Dragon Con\n, the Atlanta Journal Constitution reports. \nAtlanta Police confirmed to the AJC that an arrest had been made. \nA friend of the victim took a photo of the suspect that police distributed in an attempt to identify him. Gary Jefferson Hood was taken into custody on Thursday, the AJC reports. \nThe alleged sexual assault took place at Dragon Con on Sept. 5 after the woman began feeling dizzy and unwell at a panel.</span> After she went to the main level of the Hyatt Regency to cool down, the suspect who was wearing a cap with the letters FBI introduced himself and is accused of trying to kiss and fondle her.\nRead more at AJC.\nDragon Con was held in Downtown Atlanta Sept. 4-7."

# # print(ex_string)

# entry_spans = ""  
# exit_spans = ""
# bracket_opened = False
# span_entrance = False
# span_end = False
# highlight = False
# str_that_counts = ""
# bin_data = ""

# for character in ex_string:
#     print("")
#     print(character)
#     print("BEFORE")
#     print("span_entrance")
#     print(span_entrance)
#     print("span_end")
#     print(span_end)
#     print("highlight")
#     print(highlight)
#     print("entry_spans")
#     print(entry_spans)
#     print("exit_spans")
#     print(exit_spans)
#     if (character == "<"):
#         bracket_opened = True
#     elif (bracket_opened == True):
#         bracket_opened = False
#         if (character == "s"):
#             entry_spans += "<"
#             exit_spans += "<"
#             span_entrance = True
#         else:
#             exit_spans = exit_spans[:-1]
#             span_end = True
#             if (len(exit_spans) == 0):
#                 highlight = False
#     elif ((character == ">") & (span_end == True)):
#         span_end = False
#     elif ((character == ">") & (span_entrance == True) & (span_end != True)):
#         entry_spans = entry_spans[:-1]
#         if (len(entry_spans) == 0):
#             span_entrance = False
#             highlight = True
#     elif ((highlight == True) & (span_entrance != True) & (span_end != True)):
#         str_that_counts += character
#         bin_data += str(1)
#     elif ((highlight == False) & (span_entrance != True) & (span_end != True)):
#         str_that_counts += character
#         bin_data += str(0)
#     else:
#         pass
#     print("AFTER")
#     print("span_entrance")
#     print(span_entrance)
#     print("span_end")
#     print(span_end)
#     print("highlight")
#     print(highlight)
#     print("entry_spans")
#     print(entry_spans)
#     print("exit_spans")
#     print(exit_spans)
#     print("---")


# print(str_that_counts)
# print(len(str_that_counts))
# print(len(ex_string))
# print(bin_data)
